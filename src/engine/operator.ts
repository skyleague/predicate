import type { Expression, ValueExpression, AsExpression, DefinitionType } from './types.js'
import { fromLiteral } from './types.js'

import type { JSONExpr } from '../json/jsonexpr.type.js'

import { inspect } from 'node:util'

export interface Operator<I extends any[], O, Op extends string> {
    symbol: string
    operator: Op
    <Exprs extends { [K in keyof I]: Expression<I[K]> | I[K] }>(
        ...exprs: Exprs
    ): ValueExpression<O, { [K in keyof I]: AsExpression<Exprs[K]> }, Extract<JSONExpr, Record<Op, any[] | JSONExpr>>>
}

export function operator<I extends unknown[], O, Op extends string = string>({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    operator,
    fn,
    symbol,
}: {
    operator: Op
    fn: (args: I) => O
    symbol: string
}): Operator<I, O, Op> {
    return Object.assign(
        <Exprs extends { [K in keyof I]: Expression<I[K]> | I[K] }>(
            ...exprs: Exprs
        ): ValueExpression<O, { [K in keyof I]: AsExpression<Exprs[K]> }, Extract<JSONExpr, Record<Op, any[] | JSONExpr>>> => {
            const xs = exprs.map((x) => fromLiteral(x as I[number]))
            return {
                fn,
                dependsOn: xs,
                expr: (mod: DefinitionType) => ({
                    [operator]: xs.map((x) => x.expr(mod)),
                }),
                [inspect.custom]() {
                    return `${symbol}(${xs.map((x) => x[inspect.custom]?.() ?? '').join(', ')})`
                },
            } as unknown as ValueExpression<
                O,
                { [K in keyof I]: AsExpression<Exprs[K]> },
                Extract<JSONExpr, Record<Op, any[] | JSONExpr>>
            >
        },
        {
            symbol,
            operator,
        }
    )
}
