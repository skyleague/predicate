import { inspect } from 'node:util'
import { equal } from '@skyleague/axioms'
import { type FactsFomExprs, operator } from '../engine/operator.js'
import {
    type AsExpression,
    type Expression,
    type ExpressionTypeOfLiteral,
    fromLiteral,
    type InputFromExpressions,
    type LiteralOr,
    type ValueExpression,
} from '../engine/types.js'
import { $value, type ValueItem } from './higher-order-fn.js'

export const $startsWith = operator({
    operator: 'startsWith',
    symbol: '$startsWith',
    fn: ([str, searchString]: [str: string, searchString: string]) => str.startsWith(searchString),
})
export const $endsWith = operator({
    operator: 'endsWith',
    symbol: '$endsWith',
    fn: ([str, searchString]: [str: string, searchString: string]) => str.endsWith(searchString),
})
export const $includes = operator({
    operator: 'includes',
    symbol: '$includes',
    fn: ([str, searchString]: [str: string, searchString: string]) => str.includes(searchString),
})

export const $equal = operator({ operator: '==', symbol: '$equal', fn: ([a, b]: [unknown, unknown]) => equal(a, b) })

export const $not = operator({ operator: '~', symbol: '$not', fn: ([x]: [boolean]) => !x })

export const $gt = operator({ operator: '>', symbol: '$gt', fn: ([a, b]: [number, number]) => a > b })
export const $gte = operator({ operator: '>=', symbol: '$gte', fn: ([a, b]: [number, number]) => a >= b })
export const $lt = operator({ operator: '<', symbol: '$lt', fn: ([a, b]: [number, number]) => a < b })
export const $lte = operator({ operator: '<=', symbol: '$lte', fn: ([a, b]: [number, number]) => a <= b })

export const $all = Object.assign(
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    <Expr extends LiteralOr<any[]>, Out extends Expression<boolean>>(
        xs: Expr,
        predicate: (value: ValueItem<ExpressionTypeOfLiteral<Expr>>) => Out,
    ): ValueExpression<boolean, InputFromExpressions<[AsExpression<Expr>]>, FactsFomExprs<Expr | Out>> => {
        const _xs = fromLiteral(xs)
        const _value = $value<ExpressionTypeOfLiteral<Expr>>()
        const _transform = predicate(_value)
        return {
            fn: ([ys], ctx) => {
                return ys.every((x) => ctx.withScope(x, () => ctx.evaluate(_transform)))
            },
            dependsOn: [_xs],
            expr: (mode) => ({
                all: [_xs.expr(mode), _transform.expr(mode)],
            }),
            [inspect.custom]() {
                return `$all(${_xs[inspect.custom]?.() ?? ''}, (x) => ${_transform[inspect.custom]?.() ?? ''})`
            },
        } as ValueExpression<boolean, InputFromExpressions<[AsExpression<Expr>]>, FactsFomExprs<Expr | Out>>
    },
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    { operator: 'all', symbol: '$all', parse: (xs: any, predicate: any) => $all(xs, () => predicate) } as const,
)

export const $any = Object.assign(
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    <Expr extends LiteralOr<any[]>, Out extends Expression<boolean>>(
        xs: Expr,
        predicate: (value: ValueItem<ExpressionTypeOfLiteral<Expr>>) => Out,
    ): ValueExpression<boolean, InputFromExpressions<[AsExpression<Expr>]>, FactsFomExprs<Expr | Out>> => {
        const _xs = fromLiteral(xs)
        const _value = $value<ExpressionTypeOfLiteral<Expr>>()
        const _transform = predicate(_value)
        return {
            fn: ([ys], ctx) => {
                return ys.some((x) => ctx.withScope(x, () => ctx.evaluate(_transform)))
            },
            dependsOn: [_xs],
            expr: (mode) => ({
                any: [_xs.expr(mode), _transform.expr(mode)],
            }),
            [inspect.custom]() {
                return `$any(${_xs[inspect.custom]?.() ?? ''}, (x) => ${_transform[inspect.custom]?.() ?? ''})`
            },
        } as ValueExpression<boolean, InputFromExpressions<[AsExpression<Expr>]>, FactsFomExprs<Expr | Out>>
    },
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    { operator: 'any', symbol: '$any', parse: (xs: any, predicate: any) => $any(xs, () => predicate) } as const,
)
