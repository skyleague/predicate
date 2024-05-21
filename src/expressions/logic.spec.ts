import { $fact, $from, type Fact, type From } from './input.js'
import { $and, $if, $or } from './logic.js'

import { LogicObj } from '../../test/logic.type.js'
import { $policy } from '../engine/policy.js'
import type { LiteralExpression, ValueExpression } from '../engine/types.js'
import type { AndExpr, BooleanExpr, IfExpr, NumberExpr, OrExpr, StringExpr } from '../json/jsonexpr.type.js'

import { forAll } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { describe, expect, expectTypeOf, it } from 'vitest'

describe('if', () => {
    it('handles a simple schema case', () => {
        const input = {
            c: true,
            a: 1,
            b: 2,
            d: [],
            e: true,
        }
        const fact = $fact(LogicObj, 'input')
        const c = $from(fact, '$.c')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $if(c, x2, 1)
        const fn = $policy({ x1, x2, x3 })
        const result = fn.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
                "c": true,
                "d": [],
                "e": true,
              },
            },
            "output": {
              "x1": 1,
              "x2": 2,
              "x3": 2,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: LogicObj['a']; x2: LogicObj['a']; x3: LogicObj['a'] }>()
        expect(fn.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(LogicObj, 'input')
        const c = $from(fact, '$.c')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $if(c, x1, x2)
        const fn = $policy({ x1, x2, x3 })
        forAll(arbitrary(LogicObj), (input) => {
            const result = fn.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: input.c ? input.a : input.b })
            expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: LogicObj['a']; x2: LogicObj['a']; x3: LogicObj['a'] }>()
        })
    })

    it('handles the types', () => {
        const x1 = $if(false, 1, 2)
        expectTypeOf(x1).toEqualTypeOf<
            ValueExpression<
                number,
                [
                    LiteralExpression<false, BooleanExpr>,
                    LiteralExpression<number, NumberExpr>,
                    LiteralExpression<number, NumberExpr>,
                ],
                never,
                IfExpr
            >
        >()

        const x2 = $if(true, 1, '2')
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                string | number,
                [
                    LiteralExpression<true, BooleanExpr>,
                    LiteralExpression<number, NumberExpr>,
                    LiteralExpression<string, StringExpr>,
                ],
                never,
                IfExpr
            >
        >()
    })
})

describe('and', () => {
    it('handles a simple schema case', () => {
        const input = {
            c: true,
            a: 1,
            b: 2,
            d: [],
            e: true,
        }
        const fact = $fact(LogicObj, 'input')
        const c = $from(fact, '$.c')
        const e = $from(fact, '$.e')
        const x2 = $and(c, e)
        const fn = $policy({ c, e, x2 })
        const result = fn.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
                "c": true,
                "d": [],
                "e": true,
              },
            },
            "output": {
              "c": true,
              "e": true,
              "x2": true,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ c: boolean; e: boolean; x2: boolean }>()
        expect(fn.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(LogicObj, 'input')
        const c = $from(fact, '$.c')
        const e = $from(fact, '$.e')
        const x2 = $and(c, e)
        const fn = $policy({ c, e, x2 })
        forAll(arbitrary(LogicObj), (input) => {
            const result = fn.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ c: input.c, e: input.e, x2: input.c && input.e })
            expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
            expectTypeOf(result.output).toEqualTypeOf<{ c: boolean; e: boolean; x2: boolean }>()
        })
    })

    it('handles the types', () => {
        const fact = $fact(LogicObj, 'input')

        const x1 = $and(false, true, false)
        expectTypeOf(x1).toEqualTypeOf<
            ValueExpression<
                boolean,
                (LiteralExpression<false, BooleanExpr> | LiteralExpression<true, BooleanExpr>)[],
                never,
                AndExpr
            >
        >()

        const x2 = $and($from(fact, '$.c'), true)
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                boolean,
                (LiteralExpression<true, BooleanExpr> | From<LogicObj, boolean, Fact<LogicObj, 'input'>>)[],
                [Fact<LogicObj, 'input'>],
                AndExpr
            >
        >()

        const x3 = $and(true, $from(fact, '$.e'))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<
                boolean,
                (From<LogicObj, boolean, Fact<LogicObj, 'input'>> | LiteralExpression<true, BooleanExpr>)[],
                [Fact<LogicObj, 'input'>],
                AndExpr
            >
        >()
    })
})

describe('or', () => {
    it('handles a simple schema case', () => {
        const input = {
            c: true,
            a: 1,
            b: 2,
            d: [],
            e: true,
        }
        const fact = $fact(LogicObj, 'input')
        const c = $from(fact, '$.c')
        const e = $from(fact, '$.e')
        const x2 = $or(c, e)
        const fn = $policy({ c, e, x2 })
        const result = fn.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
                "c": true,
                "d": [],
                "e": true,
              },
            },
            "output": {
              "c": true,
              "e": true,
              "x2": true,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ c: boolean; e: boolean; x2: boolean }>()
        expect(fn.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(LogicObj, 'input')
        const c = $from(fact, '$.c')
        const e = $from(fact, '$.e')
        const x2 = $or(c, e)
        const fn = $policy({ c, e, x2 })
        forAll(arbitrary(LogicObj), (input) => {
            const result = fn.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ c: input.c, e: input.e, x2: input.c || input.e })
            expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
            expectTypeOf(result.output).toEqualTypeOf<{ c: boolean; e: boolean; x2: boolean }>()
        })
    })

    it('handles the types', () => {
        const fact = $fact(LogicObj, 'input')

        const x1 = $or(false, true, false)
        expectTypeOf(x1).toEqualTypeOf<
            ValueExpression<
                boolean,
                (LiteralExpression<false, BooleanExpr> | LiteralExpression<true, BooleanExpr>)[],
                never,
                OrExpr
            >
        >()

        const x2 = $or($from(fact, '$.c'), true)
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                boolean,
                (From<LogicObj, boolean, Fact<LogicObj, 'input'>> | LiteralExpression<true, BooleanExpr>)[],
                [Fact<LogicObj, 'input'>],
                OrExpr
            >
        >()

        const x3 = $or(true, $from(fact, '$.e'))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<
                boolean,
                (From<LogicObj, boolean, Fact<LogicObj, 'input'>> | LiteralExpression<true, BooleanExpr>)[],
                [Fact<LogicObj, 'input'>],
                OrExpr
            >
        >()
    })
})
