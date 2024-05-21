import { type FactsFomExprs, operator } from '../engine/operator.js'
import {
    type AsExpression,
    type Expression,
    type ExpressionTypeOfLiteral,
    type LiteralOr,
    type ValueExpression,
    fromLiteral,
} from '../engine/types.js'
import type { IfExpr } from '../json/jsonexpr.type.js'

export const $if = Object.assign(
    // biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
    <CE extends Expression<boolean> | boolean, UE extends LiteralOr<any>, VE extends LiteralOr<any>>(
        _condition: CE,
        _a: UE,
        _b: VE,
    ): ValueExpression<
        ExpressionTypeOfLiteral<UE> | ExpressionTypeOfLiteral<VE>,
        [AsExpression<CE>, AsExpression<UE>, AsExpression<VE>],
        FactsFomExprs<CE | UE | VE>,
        IfExpr
    > => {
        const condition = fromLiteral(_condition)
        const a = fromLiteral(_a)
        const b = fromLiteral(_b)
        return {
            fn: ([conditional, x1, x2]) => (conditional ? x1 : x2) as ExpressionTypeOfLiteral<UE> | ExpressionTypeOfLiteral<VE>,
            dependsOn: [condition, a, b],
            expr: (mod) => ({
                if: [condition.expr(mod), a.expr(mod), b.expr(mod)],
            }),
            facts: undefined as never,
        }
    },
    { operator: 'if', symbol: '$if' },
)

export const $and = operator({ operator: 'and', symbol: '$and', fn: (xs: boolean[]) => xs.every((x) => x) })

export const $or = operator({ operator: 'or', symbol: '$or', fn: (xs: boolean[]) => xs.some((x) => x) })
