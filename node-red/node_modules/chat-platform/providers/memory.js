const _ = require('underscore');

const isEmpty = value => value == null || value === '';

const _storeChatIds = {};
const _storeUserIds = {};
const _store = {};

function MemoryStore(userId, statics = {}, warnings = false) {
  //this.chatId = chatId != null ? String(chatId) : null;
  this.userId = userId != null ? String(userId) : null;
  // make sure userId is always a string
  this.statics = Object.assign({}, statics, { userId: statics.userId != null ? String(statics.userId) : undefined  });
  if (warnings && _.isEmpty(statics)) {
    console.trace('Warning: empty statics vars')
  }
  return this;
}

_.extend(MemoryStore.prototype, {
  getPayload() {
    // always precedence to userId
    if (this.userId != null && _storeUserIds[this.userId] != null) {
      return _storeUserIds[this.userId];
    } else if (this.userId != null) {
      _storeUserIds[this.userId] = {};
      return _storeUserIds[this.userId];
    }
    return {};
  },
  get(key) {
    const keys = Array.from(arguments);
    const payload = this.getPayload();

    if (keys.length === 1) {
      if (this.statics[keys[0]] != null) {
        return this.statics[keys[0]];
      } else {
        return payload[key] != null ? payload[key] : null;
      }
    }
    const result = {};
    keys.forEach(key => {
      if (this.statics[key] != null) {
        result[key] = this.statics[key];
      } else {
        result[key] = payload[key];
      }
    });
    return result;
  },
  remove() {
    const keys = Array.from(arguments);
    const payload  = this.getPayload();
    keys.forEach(key => {
      // eslint-disable-next-line prefer-reflect
      delete payload[key];
    });
    return this;
  },
  set(key, value) {
    let payload = this.getPayload();
    const staticKeys = Object.keys(this.statics);
    if (_.isString(key) && staticKeys.includes(key)) {
      console.log(`Warning: try to set a static key: ${key}`);
    } else if (_.isObject(key) && _.intersection(staticKeys, Object.keys(key)).length !== 0) {
      console.log(`Warning: try to set a static keys: ${_.intersection(staticKeys, Object.keys(key)).join(', ')}`);
    }
    // store values, skipping static keys
    if (_.isString(key) && !staticKeys.includes(key)) {
      payload[key] = value;
    } else if (_.isObject(key)) {
      payload = { ...payload, ..._.omit(key, staticKeys) };
    }
    // store the payload back
    if (this.userId != null) {
      _storeUserIds[this.userId] = payload;
    } else if (this.chatId != null) {
      _store[this.chatId] = payload;
    }
    return this;
  },
  dump() {
    const payload = this.getPayload();
    // eslint-disable-next-line no-console
    console.log(payload);
  },
  all() {
    const payload = this.getPayload();
    return payload;
  },
  clear() {
    if (this.userId != null) {
      _storeUserIds[this.userId] = {};
      _store[this.chatId] = null;
    } else if (this.chatId != null) {
      _store[this.chatId] = {};
      _storeUserIds[this.userId] = null;
    }
    return this;
  }
});

function MemoryFactory() {

  this.getOrCreateUserId = async function(chatId, transport, defaultUserId) {
    // try to find a userId given then chatId / transport for the current chatbot
    if (isEmpty(chatId)) {
      return null;
    }

    if (_storeChatIds[transport] != null && !_.isEmpty(_storeChatIds[transport][chatId])) {
      return _storeUserIds[transport][chatId];
    } else {
      const userId = !_.isEmpty(defaultUserId) ? defaultUserId : chatId;
      _storeUserIds[chatId] = _storeUserIds[chatId] != null ? _storeUserIds[chatId] : {};
      _storeUserIds[chatId][transport] = userId;
      _storeChatIds[userId] = _storeChatIds[userId] != null ? _storeChatIds[userId] : {};
      _storeChatIds[userId][transport] = chatId;
      return userId;
    }
  };

  this.getUserId = async function(chatId, transport) {
    return _storeUserIds[chatId] != null && !_.isEmpty(_storeUserIds[chatId][transport]) ?
      _storeUserIds[chatId][transport] : chatId;
  };

  this.getChatId = async function(userId, transport) {
    return _storeChatIds[userId] != null && !_.isEmpty(_storeChatIds[userId][transport]) ?
      _storeChatIds[userId][transport] : null;
  };

  this.getOrCreateContext = async function(userId, statics) {
    if (isEmpty(userId)) {
      return null;
    }
    return new MemoryStore(userId, { ...statics });
  };
  // this is only to be used in testing to simplify the testing scenarios
  // there's no really need for an async func here
  this.getOrCreateContextSync = function(userId, statics) {
    if (isEmpty(userId)) {
      return null;
    }
    return new MemoryStore(userId, { ...statics });
  };

  this.mergeUserId = async function(fromUserId, toUserId) {
    const destination = _storeChatIds[toUserId];
    const source = _storeChatIds[fromUserId];

    Object.keys(source)
      .forEach(transport => {
        const chatId = source[transport];
        // copy chatId/transport to destination if doesn't exist
        if (destination[transport] == null) {
          destination[transport] = chatId;
        }
        // replace chatId reference
        _storeUserIds[chatId][transport] = toUserId;
      });

    delete _storeChatIds[fromUserId];
  };
  this.getContext = function(userId, statics) {
    return new MemoryStore(userId, { ...statics });
  };

  this.getOrCreate = function(chatId, userId, statics) {
    console.log('getOrCreate() is deprecated, use getOrCreateContext() instead');
    if (isEmpty(chatId) && isEmpty(userId)) {
      return null;
    }
    // just create an class that just wraps chatId and userId, add static value (cline)
    const store = new MemoryStore(userId, { ...statics });
    return store;
  };

  this.get = function(chatId, userId, statics) {
    console.log('get() is deprecated');
    return new MemoryStore(chatId, userId, { ...statics });
  };

  return this;
}
_.extend(MemoryFactory.prototype, {
  name: 'Memory',
  description: 'Memory context provider, it\' fast and synchronous but it doesn\'t persists the values, once the'
    + ' server is restarted all contexts are lost. It doesn\'t requires any parameters. Good for testing.',
  get: function(/*chatId, userId*/) {
  },
  getOrCreate: function(/*chatId, userId, statics*/) {
  },
  assignToUser(userId, context) {
    console.log('assignToUser() is deprecated')
    _storeUserIds[userId] = context;
  },
  reset() {
    Object.keys(_store).forEach(key => delete _store[key]);
    Object.keys(_storeUserIds).forEach(key => delete _storeUserIds[key]);
    Object.keys(_storeChatIds).forEach(key => delete _storeUserIds[key]);
    return this;
  },
  stop: function() {
    return new Promise(function(resolve) {
      resolve();
    });
  },
  start: function() {
    return new Promise(function(resolve) {
      resolve();
    });
  }
});


module.exports = MemoryFactory;
