import { $fact, type Fact } from './input.js'
import { $from } from './input.js'
import { $max, $min } from './number-array.js'

import { MathFn } from '../../test/arithmatic.type.js'
import type { Arithmetic } from '../../test/arithmatic.type.js'
import { $policy } from '../engine/policy.js'
import type { ValueExpression } from '../engine/types.js'
import type { MaxExpr, MinExpr } from '../json/jsonexpr.type.js'

import { array, float, forAll } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { describe, expect, expectTypeOf, it } from 'vitest'

describe('min', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: [1],
            b: [],
        }
        const fact = $fact(MathFn, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $min(x1)
        const minner = $policy({ x1, x2, x3 })
        const result = minner.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": [
                  1,
                ],
                "b": [],
              },
            },
            "output": {
              "x1": [
                1,
              ],
              "x2": [],
              "x3": 1,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<MathFn>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number[]; x2: Arithmetic[]; x3: number }>()
        expect(minner.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(MathFn, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b[*].b')
        const x3 = $min(x1)
        const x4 = $min(x2)
        const minner = $policy({ x1, x2, x3, x4 })
        forAll(arbitrary(MathFn), (input) => {
            const result = minner.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({
                x1: input.a,
                x2: input.b.map((a) => a.b),
                x3: Math.min(...input.a),
                x4: Math.min(...input.b.map((a) => a.b)),
            })
            expectTypeOf(result.input.input).toEqualTypeOf<MathFn>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: number[]; x2: number[]; x3: number; x4: number }>()
        })
    })

    it('handles numbers', () => {
        const x1 = $min([1, 2])
        const minner = $policy({ x1 })
        const result = minner.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": 1,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number }>()
        expect(minner.expr()).toMatchSnapshot()
    })

    it('handles any numbers', () => {
        forAll(array(float()), (xs) => {
            const x1 = $min(xs)
            const minner = $policy({ x1 })
            const result = minner.evaluate()
            expect(result.output.x1).toEqual(Math.min(...xs))
        })
    })

    it('handles the types', () => {
        const fact = $fact(MathFn, 'input')

        const x1 = $min([1, 2])
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number, [number[]], never, MinExpr>>()

        const a = $from(fact, '$.a')
        const x2 = $min(a)
        expectTypeOf(x2).toEqualTypeOf<ValueExpression<number, [number[]], [Fact<MathFn, 'input'>], MinExpr>>()

        const b = $from(fact, '$.b..a')
        const x3 = $min(b)
        expectTypeOf(x3).toEqualTypeOf<ValueExpression<number, [number[]], [Fact<MathFn, 'input'>], MinExpr>>()
    })
})

describe('max', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: [1],
            b: [],
        }
        const fact = $fact(MathFn, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $max(x1)
        const maxer = $policy({ x1, x2, x3 })
        const result = maxer.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": [
                  1,
                ],
                "b": [],
              },
            },
            "output": {
              "x1": [
                1,
              ],
              "x2": [],
              "x3": 1,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<MathFn>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number[]; x2: Arithmetic[]; x3: number }>()
        expect(maxer.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(MathFn, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b[*].b')
        const x3 = $max(x1)
        const x4 = $max(x2)
        const maxer = $policy({ x1, x2, x3, x4 })
        forAll(arbitrary(MathFn), (input) => {
            const result = maxer.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({
                x1: input.a,
                x2: input.b.map((a) => a.b),
                x3: Math.max(...input.a),
                x4: Math.max(...input.b.map((a) => a.b)),
            })
            expectTypeOf(result.input.input).toEqualTypeOf<MathFn>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: number[]; x2: number[]; x3: number; x4: number }>()
        })
    })

    it('handles numbers', () => {
        const x1 = $max([1, 2])
        const maxer = $policy({ x1 })
        const result = maxer.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": 2,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number }>()
        expect(maxer.expr()).toMatchSnapshot()
    })

    it('handles any numbers', () => {
        forAll(array(float()), (xs) => {
            const x1 = $max(xs)
            const maxer = $policy({ x1 })
            const result = maxer.evaluate()
            expect(result.output.x1).toEqual(Math.max(...xs))
        })
    })

    it('handles the types', () => {
        const fact = $fact(MathFn, 'input')

        const x1 = $max([1, 2])
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number, [number[]], never, MaxExpr>>()

        const a = $from(fact, '$.a')
        const x2 = $max(a)
        expectTypeOf(x2).toEqualTypeOf<ValueExpression<number, [number[]], [Fact<MathFn, 'input'>], MaxExpr>>()

        const b = $from(fact, '$.b..a')
        const x3 = $max(b)
        expectTypeOf(x3).toEqualTypeOf<ValueExpression<number, [number[]], [Fact<MathFn, 'input'>], MaxExpr>>()
    })
})
