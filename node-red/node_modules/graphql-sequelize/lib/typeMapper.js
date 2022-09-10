'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapType = mapType;
exports.toGraphQL = toGraphQL;

var _graphql = require('graphql');

var _dateType = require('./types/dateType');

var _dateType2 = _interopRequireDefault(_dateType);

var _jsonType = require('./types/jsonType');

var _jsonType2 = _interopRequireDefault(_jsonType);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let customTypeMapper;
/**
 * A function to set a custom mapping of types
 * @param {Function} mapFunc
 */
function mapType(mapFunc) {
  customTypeMapper = mapFunc;
}

/**
 * Checks the type of the sequelize data type and
 * returns the corresponding type in GraphQL
 * @param  {Object} sequelizeType
 * @param  {Object} sequelizeTypes
 * @return {Function} GraphQL type declaration
 */
function toGraphQL(sequelizeType, sequelizeTypes) {

  // did the user supply a mapping function?
  // use their mapping, if it returns truthy
  // else use our defaults
  if (customTypeMapper) {
    let result = customTypeMapper(sequelizeType);
    if (result) return result;
  }

  const BOOLEAN = sequelizeTypes.BOOLEAN,
        ENUM = sequelizeTypes.ENUM,
        FLOAT = sequelizeTypes.FLOAT,
        REAL = sequelizeTypes.REAL,
        CHAR = sequelizeTypes.CHAR,
        DECIMAL = sequelizeTypes.DECIMAL,
        DOUBLE = sequelizeTypes.DOUBLE,
        INTEGER = sequelizeTypes.INTEGER,
        BIGINT = sequelizeTypes.BIGINT,
        STRING = sequelizeTypes.STRING,
        TEXT = sequelizeTypes.TEXT,
        UUID = sequelizeTypes.UUID,
        UUIDV4 = sequelizeTypes.UUIDV4,
        DATE = sequelizeTypes.DATE,
        DATEONLY = sequelizeTypes.DATEONLY,
        TIME = sequelizeTypes.TIME,
        ARRAY = sequelizeTypes.ARRAY,
        VIRTUAL = sequelizeTypes.VIRTUAL,
        JSON = sequelizeTypes.JSON,
        JSONB = sequelizeTypes.JSONB,
        CITEXT = sequelizeTypes.CITEXT;

  // Map of special characters

  const specialCharsMap = new Map([['¼', 'frac14'], ['½', 'frac12'], ['¾', 'frac34']]);

  if (sequelizeType instanceof BOOLEAN) return _graphql.GraphQLBoolean;

  if (sequelizeType instanceof FLOAT || sequelizeType instanceof REAL || sequelizeType instanceof DOUBLE) return _graphql.GraphQLFloat;

  if (sequelizeType instanceof DATE) {
    return _dateType2.default;
  }

  if (sequelizeType instanceof CHAR || sequelizeType instanceof STRING || sequelizeType instanceof TEXT || sequelizeType instanceof UUID || sequelizeType instanceof UUIDV4 || sequelizeType instanceof DATEONLY || sequelizeType instanceof TIME || sequelizeType instanceof BIGINT || sequelizeType instanceof DECIMAL || sequelizeType instanceof CITEXT) {
    return _graphql.GraphQLString;
  }

  if (sequelizeType instanceof INTEGER) {
    return _graphql.GraphQLInt;
  }

  if (sequelizeType instanceof ARRAY) {
    let elementType = toGraphQL(sequelizeType.type, sequelizeTypes);
    return new _graphql.GraphQLList(elementType);
  }

  if (sequelizeType instanceof ENUM) {
    return new _graphql.GraphQLEnumType({
      name: 'tempEnumName',
      values: (0, _lodash2.default)(sequelizeType.values).mapKeys(sanitizeEnumValue).mapValues(v => ({ value: v })).value()
    });
  }

  if (sequelizeType instanceof VIRTUAL) {
    let returnType = sequelizeType.returnType ? toGraphQL(sequelizeType.returnType, sequelizeTypes) : _graphql.GraphQLString;
    return returnType;
  }

  if (sequelizeType instanceof JSONB || sequelizeType instanceof JSON) {
    return _jsonType2.default;
  }

  throw new Error(`Unable to convert ${sequelizeType.key || sequelizeType.toSql()} to a GraphQL type`);

  function sanitizeEnumValue(value) {
    return value.trim().replace(/([^_a-zA-Z0-9])/g, (_, p) => specialCharsMap.get(p) || ' ').split(' ').map((v, i) => i ? _lodash2.default.upperFirst(v) : v).join('').replace(/(^\d)/, '_$1');
  }
}