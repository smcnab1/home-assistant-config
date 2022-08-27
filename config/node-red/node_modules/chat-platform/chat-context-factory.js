const _ = require('underscore');

const contextProviders = {};
contextProviders.memory = require('./providers/memory');
contextProviders.sqlite = require('./providers/sqlite');
contextProviders['plain-file'] = require('./providers/plain-file');

let _contexts = {};

const ContextProviders = function(RED) {

  RED = RED || {};
  // register Slack server
  if (RED.redbot == null) {
    RED.redbot = {};
  }
  if (RED.redbot.contextProviders == null) {
    RED.redbot.contextProviders = {};
  }

  if (RED.settings != null) {
    RED.settings.set('contextProviders', contextProviders);
  }

  if (RED.redbot.utils == null) {
    RED.redbot.utils = {
      when: function (param) {
        if (param != null && _.isFunction(param.then)) {
          return param;
        } else if (param != null) {
          return new Promise(function(resolve) {
            resolve(param);
          })
        }
        return new Promise(function(resolve, reject) {
          reject();
        });
      }
    };
  }

  const methods = {

    when(param) {
      if (param != null && _.isFunction(param.then)) {
        return param;
      } else if (param != null) {
        return new Promise(function(resolve) {
          resolve(param);
        })
      }
      return new Promise(function(resolve, reject) {
        reject();
      });
    },

    getProviders() {
      return _.keys(contextProviders);
    },

    hasProvider(provider) {
      return _(methods.getProviders()).contains(provider);
    },

    getProvider(providerName, params = {}) {
      const provider = contextProviders[providerName];
      const context = new provider(params);
      if (params.id != null) {
        _contexts[params.id] = context;
      }
      return context;
    },

    reset() {
      _contexts = {};
    }
  };

  return methods;
};

// Static methods

ContextProviders.getProviderById = function(id) {
  return _contexts[id];
};

ContextProviders.reset = function() {
  return _contexts = {};
};

module.exports = ContextProviders;
