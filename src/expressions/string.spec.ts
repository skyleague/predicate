import { $fact, $from, type Fact, type From } from './input.js'
import { $concat } from './string.js'

import { AbObj } from '../../test/string.type.js'
import { $policy } from '../engine/policy.js'
import type { ValueExpression, LiteralExpression } from '../engine/types.js'
import type { ConcatExpr, JSONExpr, StringExpr } from '../json/jsonexpr.type.js'

import { array, forAll, string } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { describe, expect, expectTypeOf, it } from 'vitest'

describe('concat', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: 'foo',
            b: 'bar',
        }
        const fact = $fact(AbObj, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $concat(x1, x2)
        const adder = $policy({ x1, x2, x3 })
        const result = adder.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": "foo",
                "b": "bar",
              },
            },
            "output": {
              "x1": "foo",
              "x2": "bar",
              "x3": "foobar",
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<AbObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: string; x2: string; x3: string }>()
        expect(adder.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(AbObj, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $concat(x1, x2)
        const adder = $policy({ x1, x2, x3 })
        forAll(arbitrary(AbObj), (input) => {
            const result = adder.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: input.a + input.b })
            expectTypeOf(result.input.input).toEqualTypeOf<AbObj>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: string; x2: string; x3: string }>()
        })
    })

    it('handles two strings', () => {
        const x1 = $concat('1', '2')
        const adder = $policy({ x1 })
        const result = adder.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": "12",
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: string }>()
        expect(adder.expr()).toMatchSnapshot()
    })

    it('handles any strings', () => {
        forAll(array(string(), { minLength: 2 }), (ss) => {
            const [a, b, ...xs] = ss
            const x1 = $concat(a, b, ...xs)
            const adder = $policy({ x1 })
            const result = adder.evaluate()
            expect(result.output.x1).toEqual(''.concat(...ss))
        })
    })

    it('handles the types', () => {
        const fact = $fact(AbObj, 'input')

        const x1 = $concat('1', '2')
        expectTypeOf(x1).toEqualTypeOf<
            ValueExpression<
                string,
                [
                    LiteralExpression<'1', StringExpr>,
                    LiteralExpression<'2', StringExpr>,
                    ...LiteralExpression<undefined, JSONExpr>[],
                ],
                ConcatExpr
            >
        >()

        const x2 = $concat($from(fact, '$.a'), '2')
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                string,
                [
                    From<AbObj, string, [Fact<AbObj, 'input'>]>,
                    LiteralExpression<'2', StringExpr>,
                    ...LiteralExpression<undefined, JSONExpr>[],
                ],
                ConcatExpr
            >
        >()

        const x3 = $concat('2', $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<
                string,
                [
                    LiteralExpression<'2', StringExpr>,
                    From<AbObj, string, [Fact<AbObj, 'input'>]>,
                    ...LiteralExpression<undefined, JSONExpr>[],
                ],
                ConcatExpr
            >
        >()
    })
})
