import { operator } from '../engine/operator.js'

export const $min = operator({
    operator: 'min',
    symbol: '$min',
    fn: ([ys]: [number[]]) => Math.min(...ys),
})

export const $max = operator({
    operator: 'max',
    symbol: '$max',
    fn: ([ys]: [number[]]) => Math.max(...ys),
})
