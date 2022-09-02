class CalculationBase {
  /**
   *
   * @param {moment} now
   * @param {object} event
   * @param {boolean} outputAsRgbValue
   */
  constructor (now, event, outputAsRgbValue) {
    this.now = now
    this.event = event
    this.outputAsRgbValue = outputAsRgbValue
  }

  /**
   *
   * @param {int} startTime
   * @param {int} endTime
   * @param {int} startValue
   * @param {int} endValue
   *
   * @returns {number}
   */
  _getValue (startTime, endTime, startValue, endValue) {
    let value = Math.round(((this.now.valueOf() - startTime) / (endTime - startTime)) * (endValue - startValue) + startValue)

    // TODO throw exception
    if (isNaN(value)) {
      value = 0
    }

    if (this.outputAsRgbValue) {
      value = parseInt(value * 2.55)
    }

    return value
  }
}

module.exports = CalculationBase
