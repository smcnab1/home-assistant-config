const _ = require('underscore');
const _s = require('underscore.string');
const clc = require('cli-color');
const prettyjson = require('prettyjson');
const { when } = require('./lib/utils');
const EventEmitter = require('events').EventEmitter;
const inherits = require('util').inherits;
const lcd = require('./helpers/lcd');
const Table = require('cli-table');
const request = require('request').defaults({ encoding: null });

const identity = function(obj) { return obj; };
const green = clc.greenBright;
const white = clc.white;
const yellow = clc.yellow;
const red = clc.red;
const orange = clc.xterm(214);
const grey = clc.blackBright;

if (global['redbot-chat-platform'] == null) {
  global['redbot-chat-platform'] = {
    messageTypes: [],
    events:  [],
    platforms: {},
    params: {}
  };
}

let _messageTypes = global['redbot-chat-platform'].messageTypes;
let _events = global['redbot-chat-platform'].events;
let _platforms = global['redbot-chat-platform'].platforms;
let _params = global['redbot-chat-platform'].params;
let _globalCallbacks = {};

const ChatExpress = function(options) {

  const _this = this;
  this.options = _.extend({
    color: null,
    contextProvider: null,
    connector: null,
    inboundMessage: null,
    transport: null,
    transportDescription: null,
    chatIdKey: null,
    userIdKey: null,
    messageIdKey: null,
    tsKey: null,
    debug: true,
    onStart: null,
    onStop: null,
    RED: null,
    routes: null,
    routesDescription: null,
    events: null,
    relaxChatId: false,
    bundle: false,
    multiWebHook: true
  }, options);

  this.ins = [];
  this.outs = [];
  this.uses = [];

  // init platforms
  _platforms[this.options.transport] = {
    id: this.options.transport,
    name: this.options.transportDescription,
    universal: false,
    color: this.options.color != null ? this.options.color : '#bbbbbb'
  };

  // configuration warnings
  if (_.isEmpty(this.options.chatIdKey) && !_.isFunction(this.options.chatIdKey)) {
    // eslint-disable-next-line no-console
    console.log(lcd.timestamp() + yellow('WARNING: chatIdKey option is empty'));
  }
  if (_.isEmpty(this.options.userIdKey) && !_.isFunction(this.options.userIdKey)) {
    // eslint-disable-next-line no-console
    console.log(lcd.timestamp() + yellow('WARNING: userIdKey option is empty'));
  }
  if (_.isEmpty(this.options.transport)) {
    // eslint-disable-next-line no-console
    console.log(lcd.timestamp() + yellow('WARNING: transport option is empty'));
  }

  function evaluateParam(payload, newKey, optionKey, chatServer) {
    const options = _this.options;
    if (options[optionKey] != null) {
      if (_.isString(options[optionKey]) && newKey != options[optionKey]) {
        payload[newKey] = payload[options[optionKey]];
        delete payload[options[optionKey]];
      } else if (_.isFunction(options[optionKey])) {
        payload[newKey] = options[optionKey].call(chatServer, payload);
      }
    }
  }

  async function parseMessage(payload, options, chatServer) {
    const instanceOptions = chatServer.getOptions();
    const { contextProvider, transport } = instanceOptions;

    payload = _.clone(payload);
    // sets inbound
    payload.inbound = true;
    // sets the transport
    if (!_.isEmpty(_this.options.transport)) {
      payload.transport = _this.options.transport;
    }if (!_.isEmpty(instanceOptions.transport)) {
      // use the new registered transport platform if any
      payload.transport = instanceOptions.transport;
    }

    evaluateParam(payload, 'chatId', 'chatIdKey', chatServer);
    evaluateParam(payload, 'messageId', 'messageIdKey', chatServer);
    evaluateParam(payload, 'ts', 'tsKey', chatServer);
    evaluateParam(payload, 'type', 'type', chatServer);
    evaluateParam(payload, 'language', 'language', chatServer);
    evaluateParam(payload, 'userId', 'userIdKey', chatServer);

    // evaluate callbacks
    const callbacks = chatServer.getCallbacks();
    _(['chatId', 'ts', 'type', 'language', 'messageId']).each(function(callbackName) {
      if (_.isFunction(callbacks[callbackName])) {
        payload[callbackName] = callbacks[callbackName].call(chatServer, payload)
      }
    });

    // try to evaluate a default userId
    let defaultUserId = payload.userId;
    if (_.isEmpty(defaultUserId) && _.isFunction(callbacks['userId'])) {
      defaultUserId = callbacks['userId'].call(chatServer, payload);
    }

    // get the userId from chatId, ask the context provider to create one and to create
    // the bindings between chatId <-> transport <-> userId
    payload.userId = await contextProvider.getOrCreateUserId(
      String(payload.chatId),
      transport,
      defaultUserId
    );

    // at this point should have at least the values chatId and type
    if (payload.chatId == null && !options.relaxChatId) {
      throw 'Error: inbound message key "chatId" for transport ' + _this.options.transport + ' is empty\n\n'
        + 'See here: https://github.com/guidone/node-red-contrib-chatbot/wiki/Universal-Connector-node for an '
        + 'explanation about this error.';
    }

    return payload;
  }

  function warningInboundMiddleware(message) {
    // check if message is null, perhaps someone forgot to resolve a promise
    if (message == null) {
      // eslint-disable-next-line no-console
      console.log(lcd.timestamp() + yellow('WARNING: a middleware is returning an empty message'));
    }
    if (message.payload == null) {
      // eslint-disable-next-line no-console
      console.log(lcd.timestamp() + yellow('WARNING: a middleware is returning an empty payload in message'));
    }
  }

  function prepareForConsole(payload) {
    var result = _.clone(payload) || {};
    if (result.content instanceof Buffer) {
      result.content = '<Buffer>';
    }
    if (result.ts != null) {
      result.ts = result.ts.toString();
    }
    return result;
  }

  // eslint-disable-next-line max-params
  async function createMessage(chatId, userId, messageId, inboudMessage, chatServer) {
    const options = chatServer.getOptions();
    const contextProvider = options.contextProvider;
    const onCreateMessage = _.isFunction(options.onCreateMessage) ? options.onCreateMessage : identity;
    inboudMessage = inboudMessage || {};

    if (_.isEmpty(userId) && _.isEmpty(chatId)) {
      throw 'Both userId and chatId empty, cannot start a conversation';
    }
    // get the context finding the userId given chatId, chatbotId and transport
    if (_.isEmpty(userId) && !_.isEmpty(chatId)) {
      userId = await contextProvider.getUserId(chatId, options.transport);
      if (_.isEmpty(userId)) {
        throw `Unable to resolve userId from chatId "${chatId}" (${options.transport})`;
      }
    }
    if (_.isEmpty(chatId) && !_.isEmpty(userId)) {
      if (userId === 'simulator') {
        chatId = 0; // for simulators conventionally set zero
      } else {
        chatId = await contextProvider.getChatId(userId, options.transport);
        if (_.isEmpty(chatId)) {
          throw `Unable to resolve chatId from userId "${userId}" (${options.transport}). That means either the userId "${userId}" doesn't exist or it's not possible to find a valid chatId for the platform ${options.transport}.`;
        }
      }
    }

    const chatContext = await contextProvider.getOrCreateContext(userId, {
      chatId,
      userId,
      transport: options.transport,
      chatbotId: options.chatbotId
    });

    await chatContext.set({
      authorized: false,
      pending: false,
      language: null
    });
    const message = _.extend({}, inboudMessage, {
      originalMessage: {
        chatId: chatId,
        userId: userId,
        chatbotId: options.chatbotId,
        messageId: messageId,
        transport: options.transport,
        language: null
      },
      chat() {
        return contextProvider.getContext(
          userId,
          {
            userId: this.originalMessage.userId,
            transport: this.originalMessage.transport,
            chatId: this.originalMessage.chatId
          }
        );
      },
      api() {
        return chatServer;
      },
      isTransportAvailable(transport, message) {
        return chatServer.isTransportAvailable(userId, transport, message);
      },
      isTransportPreferred(transport, message) {
        return chatServer.isTransportPreferred(userId, transport, message);
      },
      client() {
        return options.connector;
      },
      get(value) {
        return this.originalMessage[value];
      }
    });
    return onCreateMessage.call(chatServer, message);
  }

  async function inboundMessage(payload, chatServer) {
    const options = chatServer.getOptions();
    const contextProvider = options.contextProvider;
    if (chatServer.isDebug()) {
      // eslint-disable-next-line no-console
      console.log(orange('-- INBOUND MESSAGE --'));
      try {
        // eslint-disable-next-line no-console
        console.log(prettyjson.render(payload));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('PrettyJSON error');
      }
      // eslint-disable-next-line no-console
      console.log('');
    }
    // parse the message to extract the minimum payload needed for chat-platform to work properly
    // could raise errors, relay to chat server
    try {
      var parsedMessage = await parseMessage(payload, _this.options, chatServer);
    } catch(e) {
      chatServer.emit('error', e);
      return;
    }
    // create the node red message structure
    const message = {
      originalMessage: _.extend({}, payload, {
        chatId: parsedMessage.chatId,
        userId: parsedMessage.userId,
        messageId: parsedMessage.messageId,
        transport: parsedMessage.transport,
        language: parsedMessage.language,
        ts: parsedMessage.ts,
        chatbotId: options.chatbotId
      }),
      payload: {
        type: parsedMessage.type,
        chatId: parsedMessage.chatId,
        userId: parsedMessage.userId,
        ts: parsedMessage.ts,
        transport: parsedMessage.transport,
        inbound: true
      },
      chat: function() {
        return contextProvider.getContext(
          parsedMessage.userId,
          {
            userId: this.originalMessage.userId,
            transport: this.originalMessage.transport,
            chatId: this.originalMessage.chatId
          }
        );
      },
      api: function() {
        return chatServer;
      },
      client: function() {
        return chatServer.getOptions().connector;
      },
      get(value) {
        return this.originalMessage[value];
      }
    };
    // create empty promise
    let stack = new Promise(function(resolve) {
      resolve(message);
    });
    // if any context provider, then create the context
    if (contextProvider != null) {
      stack = stack
        .then(() => contextProvider.getOrCreateContext(
          parsedMessage.userId,
          {
            userId: parsedMessage.userId,
            transport: parsedMessage.transport,
            chatId: parsedMessage.chatId
          }
        ))
        .then(chatContext => when(chatContext.set({
          language: parsedMessage.language,
          authorized: false,
          pending: false
        })))
        .then(() => when(message));
    } else {
      // eslint-disable-next-line no-console
      console.log(lcd.timestamp() + yellow('WARNING: context provider was not specified'));
    }
    // run general middleware
    _(_this.uses.concat(chatServer.getUseMiddleWares())).each(function(filter) {
      stack = stack.then(function(message) {
        // encapsulate the promise to catch the error with the source code of the middleware
        return new Promise(function(resolve, reject) {
          warningInboundMiddleware(message);
          when(filter.call(chatServer, message))
            .then(resolve)
            .catch(function (error) {
              error.sourceCode = filter.toString();
              reject(error);
            });
        });
      });
    });
    // run ins middleware without any specific type
    _(_this.ins.concat(chatServer.getInMiddleWares())).each(function(filter) {
      stack = stack.then(function(message) {
        // encapsulate the promise to catch the error with the source code of the middleware
        return new Promise(function(resolve, reject) {
          warningInboundMiddleware(message);
          // if message type is null
          if (filter.type == null) {
            when(filter.method.call(chatServer, message))
              .then(resolve)
              .catch(function(error) {
                error.sourceCode = filter.method.toString();
                reject(error);
              });
          } else {
            resolve(message)
          }
        });
      });
    });
    // run ins middleware without a specific type
    _(_this.ins).each(function(filter) {
      stack = stack.then(function(message) {
        // encapsulate the promise to catch the error with the source code of the middleware
        return new Promise(function (resolve, reject) {
          warningInboundMiddleware(message);
          // if message type is the same
          if (filter.type === message.payload.type || filter.type === '*') {
            when(filter.method.call(chatServer, message))
              .then(resolve)
              .catch(function(error) {
                error.sourceCode = filter.method.toString();
                reject(error);
              });
          } else {
            resolve(message)
          }
        });
      });
    });
    // finally
    stack
      .then(function(message) {
        if (message.payload != null && message.payload.type != null) {
          if (chatServer.isDebug()) {
            // eslint-disable-next-line no-console
            console.log(orange('-- RELAY MESSAGE --'));
            try {
              // eslint-disable-next-line no-console
              console.log(prettyjson.render(prepareForConsole(message.payload)));
            } catch(e) {
              // eslint-disable-next-line no-console
              console.log('Unable to render');
            }
            // eslint-disable-next-line no-console
            console.log('');
          }
          chatServer.emit('message', message);
        } else {
          // do nothing
          if (chatServer.isDebug()) {
            // eslint-disable-next-line no-console
            console.log(orange('-- DISCARDED MESSAGE (not handled by middlewares) --'));
            // eslint-disable-next-line no-console
            console.log('');
          }
        }

      })
      .catch(function(error) {
        lcd.dump(error, 'Error in chat-platform.js');
        // dump source code if present
        if (error != null && !_.isEmpty(error.sourceCode)) {
          // eslint-disable-next-line no-console
          console.log(lcd.red(error.sourceCode));
          // eslint-disable-next-line no-console
          console.log('');
        }
        if (chatServer != null) {
          chatServer.emit('error', error);
        }
      });
  }

  function warningOutboundMiddleware(message) {
    if (message == null) {
      // eslint-disable-next-line no-console
      console.log(yellow('WARNING: a middleware is returning an empty value'));
    }
  }

  function outboundMessage(message, chatServer) {
    // if simulator message, then skip, no matter what is the platform
    if (message.originalMessage != null && message.originalMessage.simulator === true) {
      return;
    }

    if (chatServer.isDebug()) {
      // eslint-disable-next-line no-console
      console.log(orange('-- OUTBOUND MESSAGE --'));
      // eslint-disable-next-line no-console
      console.log(prettyjson.render(prepareForConsole(message.payload)));
      // eslint-disable-next-line no-console
      console.log('');
    }

    // create empty promise
    let stack = new Promise(resolve => resolve(message));

    // run general middleware
    _(_this.uses.concat(chatServer.getUseMiddleWares())).each(function(filter) {
      stack = stack.then(function(message) {
        return new Promise(function(resolve, reject) {
          warningOutboundMiddleware(message);
          when(filter.call(chatServer, message))
            .then(resolve)
            .catch(function (error) {
              error.sourceCode = filter.toString();
              reject(error);
            });
        });
      });
    });
    // run outs middleware without a specific typs
    _(_this.outs.concat(chatServer.getOutMiddleWares())).each(function(filter) {
      stack = stack.then(function(message) {
        return new Promise(function(resolve, reject) {
          // check if message is null, perhaps someone forgot to resolve a promise
          warningOutboundMiddleware(message);
          // if message type is the same
          if (filter.type == null) {
            when(filter.method.call(chatServer, message))
              .then(resolve)
              .catch(function (error) {
                error.sourceCode = filter.toString();
                reject(error);
              });
          } else {
            resolve(message);
          }
        });
      });
    });
    // run outs middleware with a specific typs
    _(_this.outs.concat(chatServer.getOutMiddleWares())).each(function(filter) {
      stack = stack.then(function(message) {
        return new Promise(function(resolve, reject) {
          // check if message is null, perhaps someone forgot to resolve a promise
          warningOutboundMiddleware(message);
          // if message type is the same
          if (message.payload != null && filter.type === message.payload.type) {
            when(filter.method.call(chatServer, message))
              .then(resolve)
              .catch(function (error) {
                error.sourceCode = filter.toString();
                reject(error);
              });
          } else {
            resolve(message);
          }
        });
      });
    });
    // finally
    return stack
      .then(function(message) {
        // move the sent payload to the conventional key "sentMessage", it's up to middleware to
        // update there the messageId
        message.sentMessage = message.payload;
        delete message.payload;
        return message;
      })
      .catch(function(error) {
        // eslint-disable-next-line no-console
        console.log(red(error));
        if (chatServer != null) {
          chatServer.emit('error', error);
        }
        // rethrow error so it can be caught by the sender node
        throw error;
      });
  }

  function unmountEvents(events, chatServer) {
    var options = chatServer.getOptions();
    var connector = options.connector;
    if (connector != null) {
      if (options.inboundMessageEvent != null) {
        connector.off(options.inboundMessageEvent);
      }
      _(events).each(function (callback, eventName) {
        connector.off(eventName);
      });
    }
  }

  function mountEvents(events, chatServer) {
    var connector = chatServer.getOptions().connector;
    if (connector != null && _.isFunction(connector.on)) {
      _(events).each(function (callback, eventName) {
        connector.on(eventName, callback.bind(chatServer));
      });
    }
    return when(true);
  }

  function unmountRoutes(RED, routes, chatServer) {
    if (routes != null) {
      const endpoints = _(routes).keys();
      if (!_.isEmpty(endpoints)) {
        let routesCount = RED.httpNode._router.stack.length;
        let idx = 0;
        let stack = RED.httpNode._router.stack;
        for(; idx < stack.length;) {
          const route = stack[idx];
          if (route != null && route.name != null) {
            const routeName = String(route.name).replace('bound ', '');
            if (_.contains(endpoints, routeName)) {
              stack.splice(idx, 1);
            } else {
              idx += 1;
            }
          } else {
            idx += 1;
          }
        }
        if (RED.httpNode._router.stack.length >= routesCount) {
          // eslint-disable-next-line no-console
          chatServer.warning('Improperly removed some routes from Express. This is normal when multiple bots are running in the same server.');
        }
      }
    }
  }

  function generateCallback(route, chatServer) {
    const options = chatServer.getOptions();
    const { webHookScheme, multiWebHook } = options;
    // build specific url if needed
    let specificUrl = '';
    if (multiWebHook && _.isFunction(webHookScheme)) {
      specificUrl = webHookScheme.call(chatServer);
    }
    return `${route}${!_.isEmpty(specificUrl) ? `/${specificUrl}` : ''}`;
  }

  // eslint-disable-next-line max-params
  function mountRoutes(RED, routes, routesDescription, chatServer) {
    if (routes != null && RED == null) {
      chatServer.warn('"RED" param is empty, impossible to mount the routes');
    }
    if (routes != null && RED != null) {
      const uiPort = RED.settings.get('uiPort');
      const options = chatServer.getOptions();
      // eslint-disable-next-line no-console
      console.log(lcd.timestamp() + '');
      // eslint-disable-next-line no-console
      console.log(lcd.timestamp() + grey('------ WebHooks for ' + options.transport.toUpperCase() + '----------------'));
      _(routes).map((middleware, route) => {
        const host = 'http://localhost' + (uiPort != '80' ? ':' + uiPort : '');
        const callback = generateCallback(route, chatServer);
        // make description
        let description = null;
        if (routesDescription != null && _.isString(routesDescription[route])) {
          description = routesDescription[route];
        } else if (routesDescription != null && _.isFunction(routesDescription[route])) {
          description = routesDescription[route].call(chatServer);
        }
        // eslint-disable-next-line no-console
        console.log(lcd.timestamp() + green(host + callback) + (description != null ? grey(' - ') + white(description) : ''));
        // attach to Express instance
        const escaped = String(`^${callback}$`).replace(RegExp('/', 'g'), '\\/');
        RED.httpNode.use(new RegExp(escaped), middleware.bind(chatServer));
        return null;
      });
      // eslint-disable-next-line no-console
      console.log(lcd.timestamp() + '');
    }
    return when(true);
  }

  var methods = {

    'in': function() {
      var type = null;
      var method = null;
      if (arguments.length === 1) {
        method = arguments[0];
      } else if (arguments.length === 2) {
        type = arguments[0];
        method = arguments[1];
      } else {
        throw '.in() wrong number of parameters';
      }

      _this.ins.push({
        type: type,
        method: method
      });
      return methods;
    },

    out: function() {
      var type = null;
      var method = null;
      if (arguments.length === 1) {
        method = arguments[0];
      } else if (arguments.length === 2) {
        type = arguments[0];
        method = arguments[1];
      } else {
        throw '.out() wrong number of parameters';
      }
      _this.outs.push({
        type: type,
        method: method
      });
      return methods;
    },

    use: function(method) {
      _this.uses.push(method);
      return methods;
    },

    mixin: function(obj) {
      _this._mixins = _.extend(_this._mixin || {}, obj);
      return methods;
    },

    registerMessageType: function(type, name, description, validator) {
      if (type == null || typeof type !== 'string') {
        throw 'Missing type in .registerMessageType()';
      }
      name = name != null ? name : _s.capitalize(type);
      let typeDescriptor = _(_messageTypes).findWhere({ type: type });
      if (typeDescriptor == null) {
        typeDescriptor = { type: type };
        _messageTypes.push(typeDescriptor);
      }
      if (name != null) {
        typeDescriptor.name = name;
      }
      if (description != null) {
        typeDescriptor.description = description;
      }
      if (typeDescriptor.platforms == null) {
        typeDescriptor.platforms = {};
      }
      if (typeDescriptor.validators == null) {
        typeDescriptor.validators = {};
      }
      typeDescriptor.platforms[options.transport] = true;
      if (_.isFunction(validator)) {
        typeDescriptor.validators[options.transport] = validator;
      }
      return this;
    },
    registerEvent: function(name, description) {
      if (name == null || typeof name !== 'string') {
        throw 'Missing name in .registerEvent()';
      }
      var eventDescriptor = _(_events).findWhere({ name: name });
      if (eventDescriptor == null) {
        eventDescriptor = { name: name };
        _events.push(eventDescriptor);
      }
      eventDescriptor.name = name;
      if (description != null) {
        eventDescriptor.description = description;
      }
      if (eventDescriptor.platforms == null) {
        eventDescriptor.platforms = {};
      }
      eventDescriptor.platforms[options.transport] = true;
      return this;
    },
    registerParam: function(name, type, config = {}) {
      if (name == null || typeof name !== 'string') {
        throw 'Missing name in .registerParam()';
      }
      if (type == null || typeof type !== 'string') {
        throw 'Missing type in .registerParam()';
      }
      if (_params[options.transport] == null) {
        _params[options.transport] = [];
      }
      _params[options.transport].push({
        name,
        type,
        placeholder: config.placeholder,
        label: !_.isEmpty(config.label) ? config.label : name,
        description: config.description,
        default: config.default,
        options: config.options
      });
      return this;
    },

    createServer: function(options) {

      options = _.extend({}, _this.options, options);
      var chatServer = null;
      var _ins = [];
      var _uses = [];
      var _outs = [];
      var _callbacks = {};

      var ChatServer = function(options) {
        this.options = options;
        this.warn = function(msg) {
          var text = '[' + options.transport.toUpperCase() + '] ' + msg;
          // eslint-disable-next-line no-console
          console.log(yellow(text));
          this.emit('warning', text);
        };
        this.error = function(msg) {
          var text = '[' + options.transport.toUpperCase() + '] ' + msg;
          // eslint-disable-next-line no-console
          console.log(red(text));
          this.emit('error', text);
        };
        this.warning = function(msg) {
          var text = '[' + options.transport.toUpperCase() + '] ' + msg;
          // eslint-disable-next-line no-console
          console.log(red(text));
          this.emit('warning', text);
        };
        this.log = function(obj) {
          // eslint-disable-next-line no-console
          console.log(prettyjson.render(obj));
        };
        this.request = function(options = {}) {
          return new Promise(function(resolve, reject) {
            request(options, function(error, response, body) {
              if (error) {
                reject(`Error calling URL ${options.url}`);
              } else {
                resolve(body);
              }
            });
          });
        };
        this.getOptions = function() {
          return this.options;
        };
        this.isDebug = function() {
          return this.options != null && this.options.debug;
        };
        this.getConnector = function() {
          return this.options.connector;
        };
        this.send = function(message) {
          var _this = this;
          // If more than one message is enqued in the same payload, send one by one through the middlewares if there
          // is not bundle option. Bundle option is used in case of multimodal messages (for example audio and video
          // at the same time) that need to be sent with a unique call
          if (options.bundle || !_.isArray(message.payload)) {
            return outboundMessage(message, this);
          } else {
            var task = when(true);
            _(message.payload).each(function(payload) {
              task = task.then(function() {
                return outboundMessage(_.extend({}, message, { payload: payload }), _this);
              });
            });
            return task;
          }
        };
        this.receive = function(message) {
          inboundMessage(message, this);
        };
        // eslint-disable-next-line max-params
        this.createMessage = function(chatId, userId, messageId, inboudMessage) {
          return createMessage(chatId, userId, messageId, inboudMessage, this);
        };
        this.in = function() {
          var type = null;
          var method = null;
          if (arguments.length === 1) {
            method = arguments[0];
          } else if (arguments.length === 2) {
            type = arguments[0];
            method = arguments[1];
          } else {
            throw '.in() wrong number of parameters';
          }
          _ins.push({
            type: type,
            method: method
          });
          return methods;
        };
        this.getInMiddleWares = function() {
          return _ins;
        };
        this.use = function(method) {
          _uses.push(method);
          return methods;
        };
        this.getUseMiddleWares = function() {
          return _uses;
        };
        this.registerMessageType = function(type, name, description, validator) {
          if (type == null || typeof type !== 'string') {
            throw 'Missing type in .registerMessageType()';
          }
          name = name != null ? name : _s.capitalize(type);
          let typeDescriptor = _(_messageTypes).findWhere({ type: type });
          if (typeDescriptor == null) {
            typeDescriptor = { type: type };
            _messageTypes.push(typeDescriptor);
          }
          if (name != null) {
            typeDescriptor.name = name;
          }
          if (description != null) {
            typeDescriptor.description = description;
          }
          if (typeDescriptor.platforms == null) {
            typeDescriptor.platforms = {};
          }
          if (typeDescriptor.validators == null) {
            typeDescriptor.validators = {};
          }
          typeDescriptor.platforms[options.transport] = true;
          if (_.isFunction(validator)) {
            typeDescriptor.validators[options.transport] = validator;
          }
          return this;
        };
        this.registerEvent = function(name, description) {
          if (name == null || typeof name !== 'string') {
            throw 'Missing name in .registerEvent()';
          }
          var eventDescriptor = _(_events).findWhere({ name: name });
          if (eventDescriptor == null) {
            eventDescriptor = { name: name };
            _events.push(eventDescriptor);
          }
          eventDescriptor.name = name;
          if (description != null) {
            eventDescriptor.description = description;
          }
          if (eventDescriptor.platforms == null) {
            eventDescriptor.platforms = {};
          }
          eventDescriptor.platforms[options.transport] = true;
          return this;
        };
        this.registerParam = function(name, type, config = {}) {
          if (name == null || typeof name !== 'string') {
            throw 'Missing name in .registerParam()';
          }
          if (type == null || typeof type !== 'string') {
            throw 'Missing type in .registerParam()';
          }
          if (_params[options.transport] == null) {
            _params[options.transport] = [];
          }
          _params[options.transport].push({
            name,
            type,
            placeholder: config.placeholder,
            label: !_.isEmpty(config.label) ? config.label : name,
            description: config.description,
            default: config.default,
            options: config.options
          });
          return this;
        };
        this.registerPlatform = function(name, label) {
          _platforms[name] = {
            id: name,
            name: !_.isEmpty(label) ? label : name,
            universal: true
          };
          var options = this.getOptions();
          options.transport = name;
          options.transportDescription = !_.isEmpty(label) ? label : name;
          return this;
        };
        this.out = function() {
          var type = null;
          var method = null;
          if (arguments.length === 1) {
            method = arguments[0];
          } else if (arguments.length === 2) {
            type = arguments[0];
            method = arguments[1];
            // automatically register the type
            this.registerMessageType(type);
          } else {
            throw '.out() wrong number of parameters';
          }
          _outs.push({
            type: type,
            method: method
          });
          return methods;
        };
        this.getOutMiddleWares = function() {
          return _outs;
        };
        this.start = function() {
          var _this = this;
          var stack = when(true);
          var options = this.getOptions();
          if (_.isFunction(options.onStart)) {
            // execute on start callback, ensure it's a properly chained promise
            stack = stack.then(function() {
              return when(options.onStart.call(chatServer));
            });
          }
          return stack
            .then(function() {
              return mountRoutes(options.RED, options.routes, options.routesDescription, _this);
            })
            .then(function() {
              return mountEvents(options.events, _this);
            })
            .then(function() {
              return _.isFunction(options.onStarted) ? when(options.onStarted.call(_this)) : when(true);
            })
            .then(function() {
              if (_this.isDebug()) {
                // eslint-disable-next-line no-console
                console.log(green(lcd.timestamp() + 'Chat server started, transport: ') + white(options.transport));
              }
              // listen to inbound event
              var connector = options.connector;
              if (connector != null && options.inboundMessageEvent != null) {
                connector.on(options.inboundMessageEvent, function (message) {
                  inboundMessage(message, chatServer);
                });
              }
              _this.emit('start');
            },
            function(error) {
              // eslint-disable-next-line no-console
              _this.error(error);
            });
        };
        this.onChatId = function(callback) {
          _callbacks.chatId = callback;
        };
        this.onUserId = function(callback) {
          _callbacks.userId = callback;
        };
        this.onTimestamp = function(callback) {
          _callbacks.ts = callback;
        };
        this.onLanguage = function(callback) {
          _callbacks.language = callback;
        };
        this.onMessageId = function(callback) {
          _callbacks.messageId = callback;
        };
        this.onGetChatIdFromUserId = function(callback) {
          _globalCallbacks.getChatIdFromUserId = callback;
        };
        this.onGetPreferredTransport = function(callback) {
          _globalCallbacks.onGetPreferredTransport = callback;
        };
        this.isTransportAvailable = function(userId, transport, message) {
          if (!_.isFunction(_globalCallbacks.getChatIdFromUserId)) {
            throw new Error('Resolver chatId<->userId not defined');
          }
          try {
            return when(_globalCallbacks.getChatIdFromUserId.call(chatServer, userId, transport, message))
              .then(chatId => {
                return chatId != null
              });
          } catch(e) {
            // todo better error displaying
            // eslint-disable-next-line no-console
            console.log(lcd.timestamp() + 'Error in resolver chatId<->userId', e);
            throw new Error('Error in resolver chatId<->userId', e);
          }
        };
        this.isTransportPreferred = function(userId, message) {
          if (!_.isFunction(_globalCallbacks.onGetPreferredTransport)) {
            throw new Error('Resolver userId<->preferred transport not defined');
          }
          try {
            return when(_globalCallbacks.onGetPreferredTransport.call(chatServer, userId, message))
              .then(preferredTransport => {
                return preferredTransport === this.options.transport;
              });
          } catch(e) {
            // todo better error displaying
            // eslint-disable-next-line no-console
            console.log(lcd.timestamp() + 'Error in resolver chatId<->preferred transport', e);
            throw new Error('Error in resolver chatId<->preferred transport', e);
          }
        };
        this.onGetUserIdFromChatId = function(callback) {
          _callbacks.getUserIdFromChatId = callback;
        };
        this.getCallbacks = function() {
          return _callbacks;
        };
        this.stop = function() {
          this.emit('stop');
          var options = this.getOptions();
          unmountRoutes(options.RED, options.routes, this);
          unmountEvents(options.events, this);
          var stack = when(true);
          if (_.isFunction(options.onStop)) {
            stack = stack.then(function() {
              return when(options.onStop.call(chatServer));
            });
          }
          return stack;
        };
        EventEmitter.call(this);
      };
      inherits(ChatServer, EventEmitter);
      _.extend(ChatServer.prototype, _this._mixins);
      // create chat instance
      chatServer = new ChatServer(options);
      return chatServer;
    }

  };
  return methods;
};

/*
  Static methods for ChatExpress
 */
ChatExpress.getMessageTypes = function() {
  return _(_messageTypes).map(function(item) {
    return {
      value: item.type,
      label: item.name,
      platforms: _(item.platforms).keys()
    };
  });
};
ChatExpress.getEvents = function() {
  return _(_events).map(function(item) {
    return {
      value: item.name,
      label: item.description,
      platforms: _(item.platforms).keys()
    };
  });
};
ChatExpress.getParams = function() {
  return _params;
};

function compatibilityTable(items, options) {
  options = _.extend({ column: 'Column' }, options);
  // collect platforms except universal
  var platforms = _(ChatExpress.getPlatforms()).chain()
    .map(function(platform) {
      return platform.id;
    })
    .reject(function(id) {
      return id === 'universal';
    })
    .sort()
    .value();
  // build header
  var head = [options.column];
  _(platforms).each(function(name) {
    head.push(_s.capitalize(name));
  });
  var colAligns = ['left'];
  _.times(platforms.length, function() {
    colAligns.push('middle');
  });
  // create table
  var table = new Table({
    head: head,
    colAligns: colAligns,
    style: {
      head: ['green']
    }
  });
  // message types columns
  _(items).chain()
    .sortBy(function(type) {
      return type.name;
    })
    .each(function(type) {
      var row = [type.name];
      _(platforms).each(function(platform) {
        if (type.platforms[platform]) {
          row.push('✔');
        } else {
          row.push('');
        }
      });
      table.push(row);
    });
  // eslint-disable-next-line no-console
  console.log(table.toString());

}

/**
 * @method showCompatibilityChart
 * Print out a compatibility char for message types
 */
ChatExpress.showCompatibilityChart = function() {
  compatibilityTable(_messageTypes, { column: 'Message type' });
  compatibilityTable(_events, { column: 'Event name' });
};

/**
 * @method getPlatforms
 * Return an array of available platforms
 * @return {Array}
 */
ChatExpress.getPlatforms = function() {
  var platforms = _(_platforms).keys();

  return _(platforms).chain()
    .map(function(platform) {
      return {
        id: _platforms[platform].id,
        name: _platforms[platform].name,
        universal: _platforms[platform].universal,
        color: _platforms[platform].color
      };
    })
    .sortBy(function(platform) {
      return platform.name != null ? platform.name : platform.id;
    })
    .value();
};

/**
 * @method isSupported
 * Check if a platform is supported (or a message type for a specified platform)
 * @param {String} platform Platform id (telegram, facebook, ...)
 * @param {String} type Message type (image, document, ...)
 * @return {Boolean}
 */
ChatExpress.isSupported = function(platform, type) {
  if (type == null) {
    const platforms = ChatExpress.getPlatforms();
    return _(platforms).findWhere({ id: platform }) != null;
  } else {
    const messageType = _(_messageTypes).findWhere({ type: type });
    return messageType != null && messageType.platforms[platform];
  }
};

/**
 * @method isValidFile
 * Check if a file type is valid (extension, size, etc), if nothing is specified file is assumed to be valid
 * @param {String} platform Platform id (telegram, facebook, ...)
 * @param {String} type Message type (image, document, ...)
 * @param {Object} file The file descriptor
 * @param {String} file.filename The filename of the file
 * @param {Buffer} file.buffer The buffer
 * @param {String} file.extension The extension of the file (with leading dot)
 * @param {String} file.mimeType Mime type of the file
 * @return {String} Null if no errors
 */
ChatExpress.isValidFile = function(platform, type, file) {
  const messageType = _(_messageTypes).findWhere({ type: type });
  if (messageType != null) {
    const validator = messageType.validators[platform];
    if (validator != null) {
      return validator(file);
    }
  }
  return null;
};

/**
 * @method registerParam
 * Register param for all transport/platforms
 * @param {String} name
 * @param {String} type Type of param
 * @param {Object} config Params of the param, pun intended
 * @chainable
 */
ChatExpress.registerParam = function(name, type, config = {}) {
  if (name == null || typeof name !== 'string') {
    throw 'Missing name in .registerParam()';
  }
  if (type == null || typeof type !== 'string') {
    throw 'Missing type in .registerParam()';
  }
  if (_params.all == null) {
    _params.all = [];
  }
  _params.all.push({
    name,
    type,
    placeholder: config.placeholder,
    label: !_.isEmpty(config.label) ? config.label : name,
    description: config.description,
    default: config.default,
    options: config.options
  });
  return this;
};

ChatExpress.reset = function() {
  // reset global callbacks, will be re-registered with deploy
  _globalCallbacks = {};
};

module.exports = ChatExpress;
