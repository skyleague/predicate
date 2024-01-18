import { operator } from '../engine/operator.js'

export const $concat = operator({
    operator: 'concat',
    symbol: '$concat',
    fn: ([a, b, ...xs]: [string, string, ...string[]]) => a.concat(b, ...xs),
})
