import type { EvaluationContext } from '../engine/policy.js'
import {
    type AsExpression,
    type Expression,
    type ExpressionTypeOfLiteral,
    type InferExpressionType,
    type InputExpression,
    type LiteralOr,
    type ValueExpression,
    fromLiteral,
} from '../engine/types.js'
import type { ValueItemExpr } from '../json/jsonexpr.type.js'

import { JSONPath, type JSONPathValue } from '@skyleague/jsonpath'

import { inspect } from 'node:util'

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export interface Value<O> extends InputExpression<O, any, [], ValueItemExpr> {
    _type: 'value'
}
function value<T, P extends string | undefined = undefined>(path?: P): P extends string ? Value<JSONPathValue<T, P>> : Value<T> {
    if (path === undefined) {
        return {
            _type: 'value',
            dependsOn: [],
            fn: (_: unknown, ctx: EvaluationContext) => ctx.scope,
            expr: () => ({ value: '$' }),
            [inspect.custom]() {
                return 'x'
            },
        } as unknown as P extends string ? Value<JSONPathValue<T, P>> : Value<T>
    }
    return {
        _type: 'value',
        dependsOn: [],
        fn: (_: unknown, ctx: EvaluationContext) => JSONPath.get(ctx.scope, path),
        expr: () => ({ value: path.toString() }),
        [inspect.custom]() {
            return `x(${path})`
        },
    } as unknown as P extends string ? Value<JSONPathValue<T, P>> : Value<T>
}

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
type ValueFn<I extends any[]> = <P extends string | undefined = undefined>(
    path?: P,
) => P extends string ? Value<JSONPathValue<I[number], P>> : Value<I[number]>

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export type ValueItem<I extends any[]> = ValueFn<I> & Value<I[number]>

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export function $value<T extends any[]>(): ValueItem<T> {
    const val = value()
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    return Object.assign((x: any) => value(x), val) as ValueItem<T>
}

export const $map = Object.assign(
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    <O extends LiteralOr<any>, Expr extends LiteralOr<any[]>>(
        xs: Expr,
        transform: (value: ValueItem<ExpressionTypeOfLiteral<Expr>>) => AsExpression<O>,
    ): ValueExpression<ExpressionTypeOfLiteral<O>[], [AsExpression<Expr>], InferExpressionType<ExpressionTypeOfLiteral<O>>> => {
        const _xs = fromLiteral(xs)
        const _value = $value<ExpressionTypeOfLiteral<Expr>>()
        const _transform = transform(_value)
        return {
            fn: ([ys], ctx) => {
                return ys.map((x) => ctx.withScope(x, () => ctx.evaluate(_transform)))
            },
            dependsOn: [_xs],
            expr: (mode) => ({
                map: [_xs.expr(mode), _transform.expr(mode)],
            }),
            [inspect.custom]() {
                return `$map(${_xs[inspect.custom]?.() ?? ''}, (x) => ${_transform[inspect.custom]?.() ?? ''})`
            },
        } as ValueExpression<ExpressionTypeOfLiteral<O>[], [AsExpression<Expr>], InferExpressionType<ExpressionTypeOfLiteral<O>>>
    },
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    { operator: 'map', symbol: '$map', parse: (xs: any, transform: any) => $map(xs, () => transform) } as const,
)

export const $filter = Object.assign(
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    <Expr extends LiteralOr<any[]>>(
        xs: Expr,
        predicate: (value: ValueItem<ExpressionTypeOfLiteral<Expr>>) => Expression<boolean>,
    ): ValueExpression<
        ExpressionTypeOfLiteral<Expr>,
        [AsExpression<Expr>],
        InferExpressionType<ExpressionTypeOfLiteral<Expr>>
    > => {
        const _xs = fromLiteral(xs)
        const _value = $value<ExpressionTypeOfLiteral<Expr>>()
        const _transform = predicate(_value)
        return {
            fn: ([ys], ctx) => {
                return ys.filter((x) => ctx.withScope(x, () => ctx.evaluate(_transform)))
            },
            dependsOn: [_xs],
            expr: (mode) => ({
                filter: [_xs.expr(mode), _transform.expr(mode)],
            }),
            [inspect.custom]() {
                return `$filter(${_xs[inspect.custom]?.() ?? ''}, (x) => ${_transform[inspect.custom]?.() ?? ''})`
            },
        } as ValueExpression<
            ExpressionTypeOfLiteral<Expr>,
            [AsExpression<Expr>],
            InferExpressionType<ExpressionTypeOfLiteral<Expr>>
        >
    },
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    { operator: 'filter', symbol: '$filter', parse: (xs: any, predicate: any) => $filter(xs, () => predicate) } as const,
)
