const _ = require('lodash')

/**
 *  Validator
 */
class Validator {
  /**
   *
   */
  constructor () {
    this.errors = []

    this.sunCalcTimes = require('./SunCalcTimes')
  }

  /**
   *
   * @returns {[]}
   */
  getErrors () {
    return this.errors
  }

  // todo better solution?
  // todo check offset?
  // todo lat, lng mandatory for suncalc?
  // todo check if suncalc event is valid date (e.q. in summer there is no night in some areas. - "Invalid Date" )
  /**
   * @param {object} event
   *
   * @returns {boolean}
   */
  validate (event) {
    let error = false
    if (_.has(event, 'start')) {
      error |= this.hasEventTimeError(event, 'start')
      error |= this.hasEventValueError(event, 'start')
    } else {
      this.errors.push('start is undefined')
      error = true
    }
    if (_.has(event, 'end')) {
      error |= this.hasEventTimeError(event, 'end')
      error |= this.hasEventValueError(event, 'end')
    } else {
      this.errors.push('end is undefined')
      error = true
    }
    if (!error) {
      error |= this.hasSameTypeError(event)
    }
    if (!_.has(event, 'topic')) {
      this.errors.push('topic is undefined')
      error = true
    }

    return error
  }

  /**
   * @param {object} event
   * @param {string} key
   *
   * @returns {boolean}
   */
  hasEventTimeError (event, key) {
    if (_.has(event[key], 'time')) {
      if (!(/(\d+):(\d+)/u.exec(event[key].time)) && !_.has(this.sunCalcTimes, event[key].time)) {
        this.errors.push(key + ' time should be a string of format hh:mm or a sun event; given: ' + event[key].time)
        return true
      }
    } else {
      this.errors.push(key + ' time is undefined')
      return true
    }
    return false
  }

  /**
   * @param {object} event
   * @param {string} key
   *
   * @returns {boolean}
   */
  hasEventValueError (event, key) {
    if (_.has(event[key], 'value')) {
      if (!_.isNumber(event[key].value) && !_.isArray(event[key].value)) {
        this.errors.push(key + ' value is not a number or array; given: ' + event[key].value)
        return true
      }
    } else {
      this.errors.push(key + ' value is undefined')
      return true
    }

    return false
  }

  /**
   *
   * @param {object} event
   * @returns {boolean}
   */
  hasSameTypeError (event) {
    if (
      (
        (_.isArray(event.start.value) && !_.isArray(event.end.value)) ||
        (!_.isArray(event.start.value) && _.isArray(event.end.value))
      ) ||
      (
        (_.isNumber(event.start.value) && !_.isNumber(event.end.value)) ||
        (!_.isNumber(event.start.value) && _.isNumber(event.end.value))
      )
    ) {
      this.errors.push('start and end value must be from same type; given: ' + typeof event.start.value + ' - ' + typeof event.start.value)
      return true
    }

    return false
  }
}

module.exports = Validator
