import { describe, expectTypeOf, it } from 'vitest'

import { Arithmetic } from '../../test/arithmatic.type.js'
import { $fact, $from, type Fact, type From } from '../expressions/input.js'
import type { BooleanExpr, NumberArrExpr, NumberExpr, StringExpr } from '../json/jsonexpr.type.js'
import { type AsExpression, type Expression, fromLiteral, type LiteralExpression } from './types.js'

describe('fromLiteral', () => {
    it('types are compabile', () => {
        expectTypeOf(fromLiteral(2)).toEqualTypeOf<LiteralExpression<number, NumberExpr>>()
        expectTypeOf(fromLiteral('foobar')).toEqualTypeOf<LiteralExpression<string, StringExpr>>()
        expectTypeOf(fromLiteral<true>(true)).toEqualTypeOf<LiteralExpression<true, BooleanExpr>>()
        expectTypeOf(fromLiteral<false>(false)).toEqualTypeOf<LiteralExpression<false, BooleanExpr>>()
        expectTypeOf(fromLiteral<boolean>(false)).toEqualTypeOf<
            LiteralExpression<true, BooleanExpr> | LiteralExpression<false, BooleanExpr>
        >()

        expectTypeOf(fromLiteral([1, 2])).toEqualTypeOf<LiteralExpression<number[], NumberArrExpr>>()
        expectTypeOf(fromLiteral([1, 2] as const)).toEqualTypeOf<LiteralExpression<readonly [1, 2], NumberArrExpr>>()

        const fact = $fact(Arithmetic, 'input')
        const fa = fromLiteral($from(fact, '$.a'))
        const _fa_: Expression<number> = fa
        expectTypeOf(fa).toEqualTypeOf<From<Arithmetic, number, Fact<Arithmetic, 'input'>>>()
        const fb = fromLiteral($from(fact, '$.b'))
        const _fb_: Expression<number> = fb
        expectTypeOf(fb).toEqualTypeOf<From<Arithmetic, number, Fact<Arithmetic, 'input'>>>()

        type val = ['1', '2']
        const _test_multiple = {} as { [K in keyof val]: AsExpression<val[K]> }
    })
})
