const _ = require('lodash')
const Validator = require('./Validator')

/**
 *  Preparation
 */
class Preparation {
  /**
   *
   * @param {[]} data
   */
  constructor (data) {
    this.data = data

    this.status = {}

    this.errors = []

    this.init()
  }

  /**
   *
   */
  init () {
    this.data = _.filter(
      _.sortBy(this.data, ['topic', 'start']),
      event => {
        const validator = new Validator()
        const hasError = validator.validate(event)

        if (!hasError) {
          // for order
          this.status[event.topic] = 0
          event.multiple = _.isArray(event.start.value) && _.isArray(event.end.value)
        } else {
          this.errors = _.merge(this.errors, validator.getErrors())
        }

        return !hasError
      })
  }

  /**
   *
   * @returns {[]}
   */
  getData () {
    return this.data
  }

  /**
   *
   * @returns {{}}
   */
  getStatus () {
    return this.status
  }

  /**
   *
   * @returns {[]}
   */
  getErrors () {
    return this.errors
  }
}

module.exports = Preparation
