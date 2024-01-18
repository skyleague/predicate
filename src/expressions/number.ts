import { operator } from '../engine/operator.js'

export const $add = operator({ operator: '+', symbol: '$add', fn: ([a, b]: [number, number]) => a + b })
export const $subtract = operator({ operator: '-', symbol: '$subtract', fn: ([a, b]: [number, number]) => a - b })
export const $divide = operator({ operator: '/', symbol: '$divide', fn: ([a, b]: [number, number]) => a / b })
export const $multiply = operator({ operator: '*', symbol: '$multiply', fn: ([a, b]: [number, number]) => a * b })
export const $modulo = operator({ operator: '%', symbol: '$modulo', fn: ([a, b]: [number, number]) => a % b })
