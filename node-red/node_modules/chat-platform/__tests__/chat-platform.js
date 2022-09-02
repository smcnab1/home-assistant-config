const moment = require('moment');
const assert = require('chai').assert;
const RED = require('../lib/red-stub')();
const ChatExpress = require('../chat-platform');
const ContextProviders = require('../chat-context-factory');
const EventEmitter = require('events').EventEmitter;
const inherits = require('util').inherits;
const contextProviders = ContextProviders(RED);


const Connector = function() {
  this.send = message => this.emit('message', message);
  return this;
};
inherits(Connector, EventEmitter);
const connector = new Connector();


const promisify = (chatServer, payload) => new Promise(
  resolve => {
    chatServer.on('start', () => connector.send(payload));
    chatServer.on('message', message => resolve(message));
    chatServer.start();
  }
);

describe('Chat platform framework', () => {

  it('should create a simple platform and retain options', async () => {

    const GenericPlatform = new ChatExpress({
      optionKey1: 'value1',
      chatIdKey: 'myChatIdKey',
      userIdKey: 'myUserIdKey',
      transport: 'generic',
      inboundMessageEvent: 'message',
      connector: connector,
      debug: false
    });
    const chatServer = GenericPlatform.createServer({
      optionKey2: 'value2',
      contextProvider: contextProviders.getProvider('memory')
    });

    assert.equal(chatServer.getOptions().optionKey1, 'value1');
    assert.equal(chatServer.getOptions().optionKey2, 'value2');

    const message = await promisify(chatServer, {
      myChatIdKey: '52',
      myUserIdKey: '62',
      type: 'a_kind_of_magic'
    });

    assert.equal(message.originalMessage.myChatIdKey, '52');
    assert.equal(message.originalMessage.chatId, '52');
    assert.equal(message.originalMessage.myUserIdKey, '62');
    assert.equal(message.originalMessage.userId, '62');
    assert.equal(message.originalMessage.transport, 'generic');
    assert.equal(message.originalMessage.type, 'a_kind_of_magic');
    assert.equal(message.payload.type, 'a_kind_of_magic');
    assert.equal(message.payload.chatId, '52');
    assert.equal(message.payload.userId, '62');
    assert.equal(message.payload.inbound, true);
    assert.equal(message.payload.transport, 'generic');
    assert.isFunction(message.chat);
    const variables = message.chat().all();
    assert.equal(variables.pending, false);
    assert.equal(variables.authorized, false);
    assert.equal(variables.authorized, false);
    const chatContext = message.chat();
    assert.equal(chatContext.get('transport'), 'generic');
    assert.equal(chatContext.get('chatId'), '52');
    assert.equal(chatContext.get('userId'), '62');

  });

  it('should create a simple platform with callbacks', async () => {
    const GenericPlatform = new ChatExpress({
      chatIdKey: payload => payload.myChatIdKey,
      userIdKey: payload => payload.myUserIdKey,
      type: payload => payload.type,
      tsKey: () => moment(),
      transport: 'generic',
      inboundMessageEvent: 'message',
      connector: connector,
      debug: false
    });
    const chatServer = GenericPlatform.createServer({
      contextProvider: contextProviders.getProvider('memory')
    });

    const message = await promisify(chatServer, {
      myChatIdKey: '52',
      myUserIdKey: '62',
      type: 'a_kind_of_magic'
    });

    assert.equal(message.originalMessage.myChatIdKey, '52');
    assert.equal(message.originalMessage.myUserIdKey, '62');
    assert.equal(message.originalMessage.type, 'a_kind_of_magic');
    assert.equal(message.payload.type, 'a_kind_of_magic');
    assert.equal(message.payload.chatId, '52');
    assert.equal(message.payload.userId, '62');
    assert.equal(message.payload.inbound, true);
    assert.equal(message.payload.transport, 'generic');
    assert.equal(message.payload.ts.isValid(), true);
    assert.isFunction(message.chat);
    const variables = message.chat().all();
    assert.equal(variables.pending, false);
    assert.equal(variables.authorized, false);
    assert.equal(variables.authorized, false);
    const chatContext = message.chat();
    assert.equal(chatContext.get('transport'), 'generic');
    assert.equal(chatContext.get('chatId'), '52');
    assert.equal(chatContext.get('userId'), '62');
  });

  it('should create a platform with middlewares', async () => {
    const GenericPlatform = new ChatExpress({
      chatIdKey: 'myChatIdKey',
      userIdKey: 'myUserIdKey',
      transport: 'generic',
      inboundMessageEvent: 'message',
      connector: connector,
      debug: false
    });
    GenericPlatform.use(message => {
      message.payload.customKey = 'value';
      return message;
    });
    GenericPlatform.in('a_kind_of_magic', message => {
      message.payload.customKey2 = 'value2';
      return message;
    });
    GenericPlatform.in('another_type', message => {
      message.payload.customKey2 = 'value3';
      return message;
    });
    GenericPlatform.in(message => {
      message.payload.customKey3 = 'value3';
      message.chat().set('customVar', 'ahaha');
      return message;
    });
    GenericPlatform.registerMessageType('a_kind_of_magic', 'A Kind of Magic');

    assert.isTrue(ChatExpress.isSupported('generic'));
    assert.isTrue(ChatExpress.isSupported('generic', 'a_kind_of_magic'));
    assert.isFalse(ChatExpress.isSupported('i_dont_exists'));
    assert.isFalse(ChatExpress.isSupported('generic', 'strange_type'));

    const chatServer = GenericPlatform.createServer({
      contextProvider: contextProviders.getProvider('memory')
    });

    const message = await promisify(chatServer, {
      myChatIdKey: '52',
      myUserIdKey: '62',
      type: 'a_kind_of_magic'
    });

    assert.equal(message.originalMessage.myChatIdKey, '52');
    assert.equal(message.originalMessage.myUserIdKey, '62');
    assert.equal(message.originalMessage.type, 'a_kind_of_magic');
    assert.equal(message.payload.type, 'a_kind_of_magic');
    assert.equal(message.payload.chatId, '52');
    assert.equal(message.payload.userId, '62');
    assert.equal(message.payload.inbound, true);
    assert.equal(message.payload.transport, 'generic');
    assert.equal(message.payload.customKey, 'value');
    assert.equal(message.payload.customKey2, 'value2');
    assert.equal(message.payload.customKey3, 'value3');
    assert.isFunction(message.chat);
    const variables = message.chat().all();
    assert.equal(variables.pending, false);
    assert.equal(variables.authorized, false);
    assert.equal(variables.authorized, false);
    assert.equal(variables.customVar, 'ahaha');
    const chatContext = message.chat();
    assert.equal(chatContext.get('transport'), 'generic');
    assert.equal(chatContext.get('chatId'), '52');
    assert.equal(chatContext.get('userId'), '62');
  });

  it('should default userId on chatId', async () => {
    const GenericPlatform = new ChatExpress({
      chatIdKey: 'myChatIdKey',
      userIdKey: 'myUserIdKey',
      transport: 'generic',
      inboundMessageEvent: 'message',
      connector: connector,
      debug: false
    });
    const chatServer = GenericPlatform.createServer({
      contextProvider: contextProviders.getProvider('memory')
    });

    const message = await promisify(chatServer, {
      myChatIdKey: '52',
      type: 'a_kind_of_magic'
    });

    assert.equal(message.originalMessage.myChatIdKey, '52');
    assert.equal(message.originalMessage.chatId, '52');
    assert.equal(message.originalMessage.userId, '52');
    assert.equal(message.originalMessage.transport, 'generic');
    assert.equal(message.originalMessage.type, 'a_kind_of_magic');
    assert.equal(message.payload.type, 'a_kind_of_magic');
    assert.equal(message.payload.chatId, '52');
    assert.equal(message.payload.userId, '52');
    assert.equal(message.payload.inbound, true);
    assert.equal(message.payload.transport, 'generic');
    assert.isFunction(message.chat);
    const variables = message.chat().all();
    assert.equal(variables.pending, false);
    assert.equal(variables.authorized, false);
    assert.equal(variables.authorized, false);
    const chatContext = message.chat();
    assert.equal(chatContext.get('transport'), 'generic');
    assert.equal(chatContext.get('chatId'), '52');
    assert.equal(chatContext.get('userId'), '52');
  });

});
