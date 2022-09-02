const CalculationMultiple = require('./Multiple')
const CalculationSingle = require('./Single')

/**
 * @param {moment} now
 * @param {object} event
 * @param {boolean} outputAsRgbValue
 *
 * @returns {CalculationMultiple|CalculationSingle}
 */
function CalculationFactory (now, event, outputAsRgbValue = false) {
  return event.multiple
    ? new CalculationMultiple(now, event, outputAsRgbValue)
    : new CalculationSingle(now, event, outputAsRgbValue)
}

module.exports = CalculationFactory
