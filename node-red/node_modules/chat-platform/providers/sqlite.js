const _ = require('underscore');

const _storeUserIds = {};
const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const fs = require('fs');
const lcd = require('../lib/lcd');

const Op = Sequelize.Op;

const isEmpty = value => value == null || value === '';

function SQLiteStore(userId, chatbotId, statics = {}, warnings = false) {
  this.userId = userId != null ? String(userId) : null;
  this.chatbotId = chatbotId;
  // make sure userId is always a string
  this.statics = Object.assign({}, statics, { userId: statics.userId != null ? String(statics.userId) : undefined  });
  if (warnings && _.isEmpty(statics)) {
    console.trace('Warning: empty statics vars');
  }
  if (warnings && _.isEmpty(chatbotId)) {
    console.trace('Warning: empty chatbotId');
  }
  return this;
}

function SQLiteFactory(params) {
  params = params || {};
  let fileCreatedAutomatically = false;
  if (_.isEmpty(params.dbPath)) {
    throw 'SQLite context provider: missing parameter "dbPath"';
  }
  if (_.isEmpty(params.chatbotId)) {
    throw 'SQLite context provider: missing parameter "chatbotId"';
  }
  if (!fs.existsSync(params.dbPath)) {
    //throw 'SQLite context provider: "dbPath" (' + params.path + ') doesn\'t exist';
    try {
      fs.copyFileSync(`${__dirname}/../blank/empty.sqlite`, params.dbPath);
      fileCreatedAutomatically = true;
    } catch(e) {
      throw 'SQLite context provider: "dbPath" (' + params.path + ') doesn\'t exist and unable to create';
    }
  }
  this.chatbotId = params.chatbotId;

  const sequelize = new Sequelize('mission_control', '', '', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: params.dbPath,
    logging: false
  });

  const Context = sequelize.define('context', {
    userId: { type: Sequelize.STRING },
    payload: { type: Sequelize.STRING },
    chatbotId: { type: Sequelize.STRING }
  }, {
    indexes: [
      { name: 'context_userid', using: 'BTREE', fields: ['userId'] },
      { name: 'context_chatbotId', using: 'BTREE', fields: ['chatbotId'] }
    ]
  });

  const ChatId = sequelize.define('chatid', {
    userId: { type: Sequelize.STRING, allowNull: false },
    chatId: { type: Sequelize.STRING, allowNull: false },
    transport: { type: Sequelize.STRING, allowNull: false },
    chatbotId: { type: Sequelize.TEXT }
  }, {
    indexes: [
      { name: 'chatid_userid', using: 'BTREE', fields: ['userId'] },
      { name: 'chatid_chatid', using: 'BTREE', fields: ['chatId'] },
      { name: 'chatid_transport', using: 'BTREE', fields: ['transport'] },
      { name: 'chatid_chatbotId', using: 'BTREE', fields: ['chatbotId'] }
    ]
  });

  // **
  // Start definition if SQLite store, with closure I can spare passing a Context as configuration
  // fo the class
  // **
  _.extend(SQLiteStore.prototype, {
    async get(key) {
      const keys = Array.from(arguments);
      const { payload } = await this.getPayload();
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
    async remove() {
      const keys = Array.from(arguments);
      const { id, payload } = await this.getPayload();
      keys.forEach(key => {
        // eslint-disable-next-line prefer-reflect
        delete payload[key];
      });
      await Context.update({ payload: JSON.stringify(payload) }, { where: { id }});
      return this;
    },

    async getPayload() {
      // get payload using userId (it generally defaults to chatId)
      const context = await Context.findOne({ where: {
        userId: this.userId,
        chatbotId: this.chatbotId
      }});

      if (context != null) {
        let payload;
        // finally decode
        try {
          payload = JSON.parse(context.payload);
        } catch(e) {
          // default if error
          payload = {};
        }
        return { payload, id: context.id };
      } else {
        // if not present then create the row
        const context = await Context.create({
          payload: JSON.stringify({}),
          chatbotId: this.chatbotId,
          userId: this.userId
        });
        return { payload: {}, id: context.id };
      }
    },

    async set(key, value) {
      let { id, payload } = await this.getPayload();
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

      await Context.update({ payload: JSON.stringify(payload) }, { where: { id }});
      return this;
    },

    async dump() {
      const { payload } = await this.getPayload();
      // eslint-disable-next-line no-console
      console.log(payload);
    },

    async all() {
      const { payload } = await this.getPayload();
      return payload;
    },

    async clear() {
      const { id } = await this.getPayload();
      await Context.update({ payload: JSON.stringify({}) }, { where: { id }})
      return this;
    }
  });

  // **
  // End definition if SQLite store
  // **

  this.getOrCreateUserId = async function(chatId, transport, defaultUserId) {
    // try to find a userId given then chatId / transport for the current chatbot
    const binding = await ChatId.findOne({
      where: { chatId, transport, chatbotId: this.chatbotId }
    });

    if (binding != null) {
      return binding.userId;
    } else {
      const userId = !_.isEmpty(defaultUserId) ? defaultUserId : chatId;
      await ChatId.create({ chatId, transport, chatbotId: this.chatbotId, userId });
      return userId;
    }
  };

  /**
   * getUserId
   * Get the userId from chatId, if doesn't exist, defaults to chatId
   */
  this.getUserId = async function(chatId, transport) {
    const binding = await ChatId.findOne({
      where: { chatId, transport, chatbotId: this.chatbotId }
    });
    return binding != null ? binding.userId : chatId;
  };

  this.getChatId = async function(userId, transport) {
    const binding = await ChatId.findOne({
      where: { userId, transport, chatbotId: this.chatbotId }
    });
    return binding != null ? binding.chatId : null;
  };

  this.getOrCreateContext = async function(userId, statics) {
    if (isEmpty(userId)) {
      return null;
    }
    // just create an class that just wraps userId, chatbotId and static value (cline)
    const store = new SQLiteStore(userId, this.chatbotId, { ...statics });
    return store;
  };

  this.mergeUserId = async function(fromUserId, toUserId) {
    const fromChatIds = await ChatId.findAll({ where: { userId: fromUserId, chatbotId: this.chatbotId }});
    const toChatIds = await ChatId.findAll({ where: { userId: toUserId, chatbotId: this.chatbotId }});

    // turn only chatIds that don't already exists
    for (const item of fromChatIds) {
      const hasTransport = toChatIds.filter(({ transport }) => transport === item.transport).length !== 0;
      if (!hasTransport) {
        await ChatId.update({ userId: toUserId }, { where: { id: item.id }});
      }
    }
  };

  // deprecated below

  this.getOrCreate = async function(chatId, userId, statics) {
    if (isEmpty(chatId) && isEmpty(userId)) {
      return null;
    }
    // just create an class that just wraps userId, chatbotId and static value (cline)
    const store = new SQLiteStore(userId, this.chatbotId, { ...statics });
    return store;
  };
  this.get = function(chatId, userId, statics) {
    console.warn('This is deprectated, use getContext instead')
    return new SQLiteStore(userId, this.chatbotId, statics);
  };
  this.getContext = function(userId, statics) {
    return new SQLiteStore(userId, this.chatbotId, statics);
  };
  this.assignToUser = async (userId, context) => {
  };
  this.reset = async () => {
    await Context.destroy({ where: {} });
  };
  this.drop = async () => {
    await sequelize.query(
      `DROP TABLE "contexts";
      DROP INDEX "chatid_userid";
      DROP INDEX "chatid_chatid";`,
      { type: QueryTypes.SELECT }
    );
  };
  this.start = async () => {
    /*
      To test dropping the table
      DROP TABLE "contexts";
      DROP INDEX "chatid_userid";
      DROP INDEX "chatid_chatid";
    */
    // if table doesn't exists, then create
    const tableExists = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='contexts';",
      { type: QueryTypes.SELECT }
    );
    const createTable = tableExists.length === 0;
    // create the table
    try {
      if (createTable) {
        await Context.sync();
        await ChatId.sync();
      }
      // then log, don't move, keep the log lines together
      console.log(lcd.timestamp() + 'SQLite context provider configuration:');
      console.log(lcd.timestamp() + '  ' + lcd.green('dbPath: ') + lcd.grey(params.dbPath)
        + (fileCreatedAutomatically ? ' - file was missing, empty one created automatically ' : ''));
      if (createTable) {
        console.log(lcd.timestamp() + '  ' + lcd.green('database: ') + lcd.grey('table missing, created successfully'));
      } else {
        console.log(lcd.timestamp() + '  ' + lcd.green('database: ') + lcd.grey('OK'));
      }
    } catch(e) {
      lcd.dump(e, 'Something went wrong creating the SQLite "contexts" table');
      throw e;
    }

    return true;
  };

  return this;
}
_.extend(SQLiteFactory.prototype, {
  name: 'SQLite',
  description: 'SQLite context provider: chat context will be stored a SQLite file. Specify the path of *.sqlite file in the'
    + ' JSON config like this <pre style="margin-top: 10px;">\n'
    + '{\n'
    + '"dbPath": "/my-path/my-database.sqlite"\n'
    + '}</pre>'
    + '<br/> The table <em>context</em> will be automatically created.',
  get: function(/*chatId, userId*/) {
  },
  getOrCreate: function(/*chatId, userId, defaults*/) {
  },
  assignToUser(userId, context) {
    // when merging a user into another, this trasnfer the current context to another user
  },
  reset() {
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

module.exports = SQLiteFactory;
