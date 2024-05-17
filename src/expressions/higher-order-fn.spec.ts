import { $equal } from './boolean.js'
import { $filter, $map, $value, type ValueItem } from './higher-order-fn.js'
import { $fact, $literal, type Fact } from './input.js'
import { $from, type From } from './input.js'
import { $add, $modulo, $multiply } from './number.js'
import { $concat } from './string.js'

import { MathFn } from '../../test/arithmatic.type.js'
import type { Arithmetic } from '../../test/arithmatic.type.js'
import { $policy } from '../engine/policy.js'
import type { Expression, LiteralExpression, ValueExpression } from '../engine/types.js'
import type { JSONExpr, NumberArrExpr, NumberExpr } from '../json/jsonexpr.type.js'

import { array, float, forAll } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { describe, expect, expectTypeOf, it } from 'vitest'

describe('value', () => {
    it('handles the types', () => {
        const x = $value<number[]>()
        expectTypeOf(x).toEqualTypeOf<ValueItem<number[]>>()
        const _y: Expression = x
        void _y
    })
})

describe('map', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: [1, 2, 3],
            b: [],
        }
        const fact = $fact(MathFn, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $map(x1, (x) => $add(x, 1))
        const hof = $policy({ x1, x2, x3 })
        const result = hof.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": [
                  1,
                  2,
                  3,
                ],
                "b": [],
              },
            },
            "output": {
              "x1": [
                1,
                2,
                3,
              ],
              "x2": [],
              "x3": [
                2,
                3,
                4,
              ],
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<MathFn>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number[]; x2: Arithmetic[]; x3: number[] }>()
        expect(hof.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(MathFn, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b[*].b')
        const b = $from(fact, '$.b')
        const x3 = $map(x1, (x) => $add(x, 1))
        const x4 = $map(x2, (x) => $multiply(2, x))
        const x5 = $map(b, (x) => $multiply(2, x('$.b')))
        const hof = $policy({ x1, x2, x3, x4, x5 })
        forAll(arbitrary(MathFn), (input) => {
            const result = hof.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({
                x1: input.a,
                x2: input.b.map((a) => a.b),
                x3: input.a.map((a) => a + 1),
                x4: input.b.map((a) => a.b * 2),
                x5: input.b.map((a) => a.b * 2),
            })
            expectTypeOf(result.input.input).toEqualTypeOf<MathFn>()
            expectTypeOf(result.output).toEqualTypeOf<{
                x1: number[]
                x2: number[]
                x3: number[]
                x4: number[]
                x5: number[]
            }>()
        })
    })

    it('handles primitive', () => {
        const x1 = $map([1, 2], (x) => $add(x, 1))
        const x2 = $map(['1', '2'], (x) => $concat(x, '1'))
        const x3 = $map([true, false], (x) => x)
        const x4 = $map([1, 2], () => $literal([1, 2]))
        const x5 = $map(['1', '2'], () => $literal(['1', '2']))
        const x6 = $map([true, false], () => $literal([true, false]))
        const hof = $policy({ x1, x2, x3, x4, x5, x6 })
        const result = hof.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": [
                2,
                3,
              ],
              "x2": [
                "11",
                "21",
              ],
              "x3": [
                true,
                false,
              ],
              "x4": [
                [
                  1,
                  2,
                ],
                [
                  1,
                  2,
                ],
              ],
              "x5": [
                [
                  "1",
                  "2",
                ],
                [
                  "1",
                  "2",
                ],
              ],
              "x6": [
                [
                  true,
                  false,
                ],
                [
                  true,
                  false,
                ],
              ],
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{
            x1: number[]
            x2: string[]
            x3: boolean[]
            x4: number[][]
            x5: string[][]
            x6: boolean[][]
        }>()
        expect(hof.expr()).toMatchSnapshot()
    })

    it('handles any numbers', () => {
        forAll(array(float()), (xs) => {
            const x1 = $map(xs, (x) => $add(x, 1))
            const hof = $policy({ x1 })
            const result = hof.evaluate()
            expect(result.output.x1).toEqual(xs.map((x) => x + 1))
        })
    })

    it('handles the types', () => {
        const fact = $fact(MathFn, 'input')

        const x1 = $map([1, 2], (x) => x)
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number[], [LiteralExpression<number[], NumberArrExpr>], NumberExpr>>()

        const a = $from(fact, '$.a')
        const x2 = $map(a, (x) => x)
        expectTypeOf(x2).toEqualTypeOf<ValueExpression<number[], [From<MathFn, number[], [Fact<MathFn, 'input'>]>], NumberExpr>>()

        const ba = $from(fact, '$.b..a')
        const x3 = $map(ba, (x) => x)
        expectTypeOf(x3).toEqualTypeOf<ValueExpression<number[], [From<MathFn, number[], [Fact<MathFn, 'input'>]>], NumberExpr>>()

        const b = $from(fact, '$.b')
        const x4 = $map(b, (x) => x('$.a'))
        expectTypeOf(x4).toEqualTypeOf<
            ValueExpression<number[], [From<MathFn, Arithmetic[], [Fact<MathFn, 'input'>]>], NumberExpr>
        >()
    })
})

describe('filter', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: [1, 2, 3],
            b: [],
        }
        const fact = $fact(MathFn, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $filter(x1, (x) => $equal(0, $modulo(x, 2)))
        const hof = $policy({ x1, x2, x3 })
        const result = hof.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": [
                  1,
                  2,
                  3,
                ],
                "b": [],
              },
            },
            "output": {
              "x1": [
                1,
                2,
                3,
              ],
              "x2": [],
              "x3": [
                2,
              ],
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<MathFn>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number[]; x2: Arithmetic[]; x3: number[] }>()
        expect(hof.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(MathFn, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b[*].b')
        const b = $from(fact, '$.b')
        const x3 = $filter(x1, (x) => $equal(0, $modulo(x, 2)))
        const x4 = $filter(x2, (x) => $equal(1, $modulo(x, 2)))
        const x5 = $filter(b, (x) => $equal(1, $modulo(x('$.b'), 2)))
        const hof = $policy({ x1, x2, x3, x4, x5 })
        forAll(arbitrary(MathFn), (input) => {
            const result = hof.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({
                x1: input.a,
                x2: input.b.map((a) => a.b),
                x3: input.a.filter((a) => a % 2 === 0),
                x4: input.b.filter((a) => a.b % 2 === 1),
                x5: input.b.filter((a) => a.b % 2 === 1),
            })
            expectTypeOf(result.input.input).toEqualTypeOf<MathFn>()
            expectTypeOf(result.output).toEqualTypeOf<{
                x1: number[]
                x2: number[]
                x3: number[]
                x4: number[]
                x5: Arithmetic[]
            }>()
        })
    })

    it('handles any numbers', () => {
        forAll(array(float()), (xs) => {
            const x1 = $filter(xs, (x) => $equal($modulo(x, 2), 1))
            const hof = $policy({ x1 })
            const result = hof.evaluate()
            expect(result.output.x1).toEqual(xs.filter((x) => x % 2 === 1))
        })
    })

    it('handles the types', () => {
        const fact = $fact(MathFn, 'input')

        const x1 = $filter([1, 2], (x) => $equal(x, 1))
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number[], [LiteralExpression<number[], NumberArrExpr>], NumberArrExpr>>()

        const a = $from(fact, '$.a')
        const x2 = $filter(a, (x) => $equal(x, 1))
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<number[], [From<MathFn, number[], [Fact<MathFn, 'input'>]>], NumberArrExpr>
        >()

        const ba = $from(fact, '$.b..a')
        const x3 = $filter(ba, (x) => $equal(x, 1))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<number[], [From<MathFn, number[], [Fact<MathFn, 'input'>]>], NumberArrExpr>
        >()

        const b = $from(fact, '$.b')
        const x4 = $filter(b, (x) => $equal(1, x('$.a')))
        expectTypeOf(x4).toEqualTypeOf<
            ValueExpression<Arithmetic[], [From<MathFn, Arithmetic[], [Fact<MathFn, 'input'>]>], JSONExpr>
        >()
    })
})
