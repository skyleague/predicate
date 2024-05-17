import type { Schema } from '@skyleague/therefore'
import { $all, $any, $endsWith, $equal, $gt, $gte, $includes, $lt, $lte, $not, $startsWith } from '../src/expressions/boolean.js'
import { $filter, $map } from '../src/expressions/higher-order-fn.js'
import { $fact, $from, $literal } from '../src/expressions/input.js'
import { $and, $or } from '../src/expressions/logic.js'
import { $max, $min } from '../src/expressions/number-array.js'
import { $add, $divide, $modulo, $multiply, $subtract } from '../src/expressions/number.js'
import { $concat } from '../src/expressions/string.js'

import { type Dependent, array, boolean, dependentArbitrary, equal, float, oneOf, sha256, string, tuple } from '@skyleague/axioms'
import { v4 as uuidv4 } from 'uuid'

const asArbitrary = <T>(arb: () => Dependent<T>) => dependentArbitrary((ctx) => arb().value(ctx))

const from = <T>(arb: Dependent<T>) =>
    arb.map((x) => {
        const name = sha256(uuidv4()).slice(0, 8)
        const description = sha256(uuidv4()).slice(0, 4)
        return [x, $from($fact({ schema: { description } } as unknown as Schema<unknown>, name), '$'), { [name]: x }] as const
    })

export const numberFnExpression = oneOf(
    asArbitrary(() => addExpression),
    asArbitrary(() => subtractExpression),
    asArbitrary(() => divideExpression),
    asArbitrary(() => multiplyExpression),
    asArbitrary(() => moduloExpression),
    asArbitrary(() => minExpression),
    asArbitrary(() => maxExpression),
)

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export const numberExpression: Dependent<readonly [number, any, Readonly<Record<string, unknown>>]> = oneOf(
    float().map((x) => [x, $literal(x), {}] as const),
    from(float()),
    numberFnExpression,
)

export const addExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] + b[0], $add(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const subtractExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] - b[0], $subtract(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const divideExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] / b[0], $divide(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const multiplyExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] * b[0], $multiply(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const moduloExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] % b[0], $modulo(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const minExpression = tuple(asArbitrary(() => numberArrayExpression)).map(
    ([[xs, expr, input]]) => [Math.min(...xs), $min(expr), input] as const,
)

export const maxExpression = tuple(asArbitrary(() => numberArrayExpression)).map(
    ([[xs, expr, input]]) => [Math.max(...xs), $max(expr), input] as const,
)

export const numberArrayFnExpression = oneOf(
    asArbitrary(() => mapNumberExpression),
    asArbitrary(() => filterNumberExpression),
)

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export const numberArrayExpression: Dependent<readonly [number[], any, Readonly<Record<string, unknown>>]> = oneOf(
    array(float()).map((x) => [x, $literal(x), {}] as const),
    from(array(float())),
    numberArrayFnExpression,
)

export const mapNumberExpression = tuple(asArbitrary(() => numberArrayExpression)).chain(([xs]) =>
    numberExpression.map((x) => [new Array(xs[0].length).fill(x[0]), $map(xs[1], () => x[1]), { ...x[2], ...xs[2] }] as const),
)

export const filterNumberExpression = tuple(asArbitrary(() => numberArrayExpression)).chain(([xs]) =>
    booleanExpression.map((x) => [xs[0].filter((_a) => x[0]), $filter(xs[1], () => x[1]), { ...x[2], ...xs[2] }] as const),
)

export const booleanFnExpression = oneOf(
    asArbitrary(() => startsWithExpression),
    asArbitrary(() => endsWithExpression),
    asArbitrary(() => includesExpression),
    asArbitrary(() => andExpression),
    asArbitrary(() => orExpression),
    asArbitrary(() => equalExpr),
    asArbitrary(() => gtExpression),
    asArbitrary(() => gteExpression),
    asArbitrary(() => ltExpression),
    asArbitrary(() => lteExpression),
    asArbitrary(() => notExpression),
    asArbitrary(() => anyExpr),
    asArbitrary(() => allExpr),
)

export const gtExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] > b[0], $gt(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const gteExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] >= b[0], $gte(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const ltExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] < b[0], $lt(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const lteExpression = tuple(numberExpression, numberExpression).map(
    ([a, b]) => [a[0] <= b[0], $lte(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const notExpression = tuple(asArbitrary(() => booleanExpression)).map(([x]) => [!x[0], $not(x[1]), x[2]] as const)

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export const booleanExpression: Dependent<readonly [boolean, any, Readonly<Record<string, unknown>>]> = oneOf(
    boolean().map((x) => [x, $literal(x), {}] as const),
    from(boolean()),
    booleanFnExpression,
)

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export const booleanArrayExpression: Dependent<readonly [boolean[], any, Readonly<Record<string, unknown>>]> = oneOf(
    array(boolean()).map((x) => [x, $literal(x), {}] as const),
    from(array(boolean())),
    // [booleanFnExpression]
)

export const stringFnExpression = oneOf(asArbitrary(() => concatExpression))

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export const stringExpression: Dependent<readonly [string, any, Readonly<Record<string, unknown>>]> = oneOf(
    string().map((x) => [x, $literal(x), {}] as const),
    from(string()),
    stringFnExpression,
)

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export const stringArrayExpression: Dependent<readonly [string[], any, Readonly<Record<string, unknown>>]> = oneOf(
    array(string()).map((x) => [x, $literal(x), {}] as const),
    from(array(string())),
    // stringFnExpression
)

export const concatExpression = tuple(stringExpression, stringExpression).map(
    ([a, b]) => [a[0].concat(b[0]), $concat(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const startsWithExpression = tuple(stringExpression, stringExpression).map(
    ([a, b]) => [a[0].startsWith(b[0]), $startsWith(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const endsWithExpression = tuple(stringExpression, stringExpression).map(
    ([a, b]) => [a[0].endsWith(b[0]), $endsWith(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const includesExpression = tuple(stringExpression, stringExpression).map(
    ([a, b]) => [a[0].includes(b[0]), $includes(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const andExpression = array(booleanExpression).map(
    (xs) => [xs.every((x) => x[0]), $and(...xs.map((x) => x[1])), Object.assign({}, ...xs.map((x) => x[2]))] as const,
)

export const orExpression = array(booleanExpression).map(
    (xs) => [xs.some((x) => x[0]), $or(...xs.map((x) => x[1])), Object.assign({}, ...xs.map((x) => x[2]))] as const,
)

export const valueArrayExpression = oneOf(numberArrayExpression, booleanArrayExpression, stringArrayExpression)

export const valueExpression = oneOf(numberExpression, booleanExpression, stringExpression, valueArrayExpression)

export const equalExpr = tuple(valueExpression, valueExpression).map(
    ([a, b]) => [equal(a[0], b[0]), $equal(a[1], b[1]), { ...a[2], ...b[2] }] as const,
)

export const anyExpr = tuple(valueArrayExpression, booleanExpression).map(
    ([xs, b]) => [xs[0].some((_) => b[0]), $any(xs[1], () => b[1]), { ...xs[2], ...b[2] }] as const,
)

export const allExpr = tuple(valueArrayExpression, booleanExpression).map(
    ([xs, b]) => [xs[0].every((_) => b[0]), $all(xs[1], () => b[1]), { ...xs[2], ...b[2] }] as const,
)
