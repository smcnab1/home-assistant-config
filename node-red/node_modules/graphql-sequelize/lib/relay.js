'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sequelizeConnection = exports.createConnectionResolver = exports.sequelizeNodeInterface = exports.NodeTypeMapper = undefined;

var _bluebird = require('bluebird');

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.idFetcher = idFetcher;
exports.typeResolver = typeResolver;
exports.isConnection = isConnection;
exports.handleConnection = handleConnection;
exports.createNodeInterface = createNodeInterface;
exports.nodeType = nodeType;
exports.createConnection = createConnection;

var _graphqlRelay = require('graphql-relay');

var _graphql = require('graphql');

var _base = require('./base64.js');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _simplifyAST = require('./simplifyAST');

var _simplifyAST2 = _interopRequireDefault(_simplifyAST);

var _sequelize = require('sequelize');

var _replaceWhereOperators = require('./replaceWhereOperators.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getModelOfInstance(instance) {
  return instance instanceof _sequelize.Model ? instance.constructor : instance.Model;
}

class NodeTypeMapper {
  constructor() {
    this.map = {};
  }

  mapTypes(types) {
    Object.keys(types).forEach(k => {
      let v = types[k];
      this.map[k] = v.type ? v : { type: v };
    });
  }

  item(type) {
    return this.map[type];
  }
}

exports.NodeTypeMapper = NodeTypeMapper;
function idFetcher(sequelize, nodeTypeMapper) {
  return (() => {
    var _ref = (0, _bluebird.coroutine)(function* (globalId, context, info) {
      var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId);

      const type = _fromGlobalId.type,
            id = _fromGlobalId.id;


      const nodeType = nodeTypeMapper.item(type);
      if (nodeType && typeof nodeType.resolve === 'function') {
        const res = yield Promise.resolve(nodeType.resolve(globalId, context, info));
        if (res) res.__graphqlType__ = type;
        return res;
      }

      const model = Object.keys(sequelize.models).find(function (model) {
        return model === type;
      });
      if (model) {
        return sequelize.models[model].findById(id);
      }

      if (nodeType) {
        return typeof nodeType.type === 'string' ? info.schema.getType(nodeType.type) : nodeType.type;
      }

      return null;
    });

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  })();
}

function typeResolver(nodeTypeMapper) {
  return (obj, context, info) => {
    var type = obj.__graphqlType__ || (obj.Model ? obj.Model.options.name.singular : obj._modelOptions ? obj._modelOptions.name.singular : obj.name);

    if (!type) {
      throw new Error(`Unable to determine type of ${typeof obj}. ` + `Either specify a resolve function in 'NodeTypeMapper' object, or specify '__graphqlType__' property on object.`);
    }

    const nodeType = nodeTypeMapper.item(type);
    if (nodeType) {
      return typeof nodeType.type === 'string' ? info.schema.getType(nodeType.type) : nodeType.type;
    }

    return null;
  };
}

function isConnection(type) {
  return typeof type.name !== 'undefined' && type.name.endsWith('Connection');
}

function handleConnection(values, args) {
  return (0, _graphqlRelay.connectionFromArray)(values, args);
}

function createNodeInterface(sequelize) {
  let nodeTypeMapper = new NodeTypeMapper();
  const nodeObjects = (0, _graphqlRelay.nodeDefinitions)(idFetcher(sequelize, nodeTypeMapper), typeResolver(nodeTypeMapper));

  return _extends({
    nodeTypeMapper: nodeTypeMapper
  }, nodeObjects);
}

exports.sequelizeNodeInterface = createNodeInterface;
function nodeType(connectionType) {
  return connectionType._fields.edges.type.ofType._fields.node.type;
}

function createConnectionResolver(_ref2) {
  let targetMaybeThunk = _ref2.target,
      _before = _ref2.before,
      _after = _ref2.after,
      where = _ref2.where,
      orderByEnum = _ref2.orderBy,
      ignoreArgs = _ref2.ignoreArgs;

  _before = _before || (options => options);
  _after = _after || (result => result);

  let orderByAttribute = function orderByAttribute(orderAttr, _ref3) {
    let source = _ref3.source,
        args = _ref3.args,
        context = _ref3.context,
        info = _ref3.info;

    return typeof orderAttr === 'function' ? orderAttr(source, args, context, info) : orderAttr;
  };

  let orderByDirection = function orderByDirection(orderDirection, args) {
    if (args.last) {
      return orderDirection.indexOf('ASC') >= 0 ? orderDirection.replace('ASC', 'DESC') : orderDirection.replace('DESC', 'ASC');
    }
    return orderDirection;
  };

  /**
   * Creates a cursor given a item returned from the Database
   * @param  {Object}   item   sequelize row
   * @param  {Integer}  index  the index of this item within the results, 0 indexed
   * @return {String}          The Base64 encoded cursor string
   */
  let toCursor = function toCursor(item, index) {
    const model = getModelOfInstance(item);
    const id = model ? typeof model.primaryKeyAttribute === 'string' ? item[model.primaryKeyAttribute] : null : item[Object.keys(item)[0]];
    return (0, _base.base64)(JSON.stringify([id, index]));
  };

  /**
   * Decode a cursor into its component parts
   * @param  {String} cursor Base64 encoded cursor
   * @return {Object}        Object containing ID and index
   */
  let fromCursor = function fromCursor(cursor) {
    var _JSON$parse = JSON.parse((0, _base.unbase64)(cursor)),
        _JSON$parse2 = _slicedToArray(_JSON$parse, 2);

    let id = _JSON$parse2[0],
        index = _JSON$parse2[1];


    return {
      id: id,
      index: index
    };
  };

  let argsToWhere = function argsToWhere(args) {
    let result = {};

    if (where === undefined) return result;

    _lodash2.default.each(args, (value, key) => {
      if (ignoreArgs && key in ignoreArgs) return;
      Object.assign(result, where(key, value, result));
    });

    return (0, _replaceWhereOperators.replaceWhereOperators)(result);
  };

  let resolveEdge = function resolveEdge(item, index, queriedCursor) {
    let sourceArgs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    let source = arguments[4];

    let startIndex = null;
    if (queriedCursor) startIndex = Number(queriedCursor.index);
    if (startIndex !== null) {
      startIndex++;
    } else {
      startIndex = 0;
    }

    return {
      cursor: toCursor(item, index + startIndex),
      node: item,
      source: source,
      sourceArgs: sourceArgs
    };
  };

  let $resolver = require('./resolver')(targetMaybeThunk, {
    handleConnection: false,
    list: true,
    before: function before(options, args, context, info) {
      const target = info.target;
      const model = target.target ? target.target : target;

      if (args.first || args.last) {
        options.limit = parseInt(args.first || args.last, 10);
      }

      // Grab enum type by name if it's a string
      orderByEnum = typeof orderByEnum === 'string' ? info.schema.getType(orderByEnum) : orderByEnum;

      let orderBy = args.orderBy ? args.orderBy : orderByEnum ? [orderByEnum._values[0].value] : [[model.primaryKeyAttribute, 'ASC']];

      if (orderByEnum && typeof orderBy === 'string') {
        orderBy = [orderByEnum._nameLookup[args.orderBy].value];
      }

      let orderAttribute = orderByAttribute(orderBy[0][0], {
        source: info.source,
        args: args,
        context: context,
        info: info
      });
      let orderDirection = orderByDirection(orderBy[0][1], args);

      options.order = [[orderAttribute, orderDirection]];

      if (orderAttribute !== model.primaryKeyAttribute) {
        options.order.push([model.primaryKeyAttribute, orderByDirection('ASC', args)]);
      }

      if (typeof orderAttribute === 'string') {
        options.attributes.push(orderAttribute);
      }

      if (options.limit && !options.attributes.some(attribute => attribute.length === 2 && attribute[1] === 'full_count')) {
        if (model.sequelize.dialect.name === 'postgres') {
          options.attributes.push([model.sequelize.literal('COUNT(*) OVER()'), 'full_count']);
        } else if (model.sequelize.dialect.name === 'mssql' || model.sequelize.dialect.name === 'sqlite') {
          options.attributes.push([model.sequelize.literal('COUNT(1) OVER()'), 'full_count']);
        }
      }

      options.where = argsToWhere(args);

      if (args.after || args.before) {
        let cursor = fromCursor(args.after || args.before);
        let startIndex = Number(cursor.index);

        if (startIndex >= 0) options.offset = startIndex + 1;
      }

      options.attributes.unshift(model.primaryKeyAttribute); // Ensure the primary key is always the first selected attribute
      options.attributes = _lodash2.default.uniq(options.attributes);
      return _before(options, args, context, info);
    },
    after: (() => {
      var _ref4 = (0, _bluebird.coroutine)(function* (values, args, context, info) {
        const source = info.source,
              target = info.target;


        var cursor = null;

        if (args.after || args.before) {
          cursor = fromCursor(args.after || args.before);
        }

        let edges = values.map(function (value, idx) {
          return resolveEdge(value, idx, cursor, args, source);
        });

        let firstEdge = edges[0];
        let lastEdge = edges[edges.length - 1];
        let fullCount = values[0] && (values[0].dataValues || values[0]).full_count && parseInt((values[0].dataValues || values[0]).full_count, 10);

        if (!values[0]) {
          fullCount = 0;
        }

        if ((args.first || args.last) && (fullCount === null || fullCount === undefined)) {
          // In case of `OVER()` is not available, we need to get the full count from a second query.
          const options = yield Promise.resolve(_before({
            where: argsToWhere(args)
          }, args, context, info));

          if (target.count) {
            if (target.associationType) {
              fullCount = yield target.count(source, options);
            } else {
              fullCount = yield target.count(options);
            }
          } else {
            fullCount = yield target.manyFromSource.count(source, options);
          }
        }

        let hasNextPage = false;
        let hasPreviousPage = false;
        if (args.first || args.last) {
          const count = parseInt(args.first || args.last, 10);
          let index = cursor ? Number(cursor.index) : null;
          if (index !== null) {
            index++;
          } else {
            index = 0;
          }

          hasNextPage = index + 1 + count <= fullCount;
          hasPreviousPage = index - count >= 0;

          if (args.last) {
            var _ref5 = [hasPreviousPage, hasNextPage];
            hasNextPage = _ref5[0];
            hasPreviousPage = _ref5[1];
          }
        }

        return _after({
          source: source,
          args: args,
          where: argsToWhere(args),
          edges: edges,
          pageInfo: {
            startCursor: firstEdge ? firstEdge.cursor : null,
            endCursor: lastEdge ? lastEdge.cursor : null,
            hasNextPage: hasNextPage,
            hasPreviousPage: hasPreviousPage
          },
          fullCount: fullCount
        }, args, context, info);
      });

      function after(_x5, _x6, _x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return after;
    })()
  });

  let resolveConnection = (source, args, context, info) => {
    var fieldNodes = info.fieldASTs || info.fieldNodes;
    if ((0, _simplifyAST2.default)(fieldNodes[0], info).fields.edges) {
      return $resolver(source, args, context, info);
    }

    return _after({
      source: source,
      args: args,
      where: argsToWhere(args)
    }, args, context, info);
  };

  return {
    resolveEdge: resolveEdge,
    resolveConnection: resolveConnection
  };
}

exports.createConnectionResolver = createConnectionResolver;
function createConnection(_ref6) {
  let name = _ref6.name,
      nodeType = _ref6.nodeType,
      targetMaybeThunk = _ref6.target,
      orderByEnum = _ref6.orderBy,
      before = _ref6.before,
      after = _ref6.after,
      connectionFields = _ref6.connectionFields,
      edgeFields = _ref6.edgeFields,
      where = _ref6.where;

  var _connectionDefinition = (0, _graphqlRelay.connectionDefinitions)({
    name: name,
    nodeType: nodeType,
    connectionFields: connectionFields,
    edgeFields: edgeFields
  });

  const edgeType = _connectionDefinition.edgeType,
        connectionType = _connectionDefinition.connectionType;


  let $connectionArgs = _extends({}, _graphqlRelay.connectionArgs);

  if (orderByEnum) {
    $connectionArgs.orderBy = {
      type: new _graphql.GraphQLList(orderByEnum)
    };
  }

  var _createConnectionReso = createConnectionResolver({
    orderBy: orderByEnum,
    target: targetMaybeThunk,
    before: before,
    after: after,
    where: where,
    ignoreArgs: $connectionArgs
  });

  const resolveEdge = _createConnectionReso.resolveEdge,
        resolveConnection = _createConnectionReso.resolveConnection;


  return {
    connectionType: connectionType,
    edgeType: edgeType,
    nodeType: nodeType,
    resolveEdge: resolveEdge,
    resolveConnection: resolveConnection,
    connectionArgs: $connectionArgs,
    resolve: resolveConnection
  };
}

exports.sequelizeConnection = createConnection;