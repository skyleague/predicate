import { inspect } from 'node:util'
import type { JSONExpr } from '../json/jsonexpr.type.js'
import type { AsExpression, DefinitionType, Expression, ValueExpression } from './types.js'
import { fromLiteral } from './types.js'

export type FactsFomExprs<T> = T extends { facts: infer U } ? U : never

// biome-ignore lint/suspicious/noExplicitAny: any is necessary for the operator function
export interface Operator<I extends any[], O, Op extends string> {
    symbol: string
    operator: Op
    <Exprs extends { [K in keyof I]: Expression<I[K]> | I[K] }>(
        ...exprs: Exprs
    ): ValueExpression<
        O,
        { [K in keyof I]: AsExpression<Exprs[K]> },
        FactsFomExprs<Exprs[number]>,
        // biome-ignore lint/suspicious/noExplicitAny: any is necessary for the operator function
        Extract<JSONExpr, Record<Op, any[] | JSONExpr>>
    >
}

export function operator<I extends unknown[], O, Op extends string = string>({
    operator,
    fn,
    symbol,
}: {
    operator: Op
    fn: (args: I) => O
    symbol: string
}): Operator<I, O, Op> {
    return Object.assign(
        <Exprs extends { [K in keyof I]: Expression<I[K]> | I[K] }>(...exprs: Exprs) => {
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
            }
        },
        {
            symbol,
            operator,
        },
    ) as unknown as Operator<I, O, Op>
}
