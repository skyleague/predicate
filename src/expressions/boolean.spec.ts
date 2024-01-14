import { $all, $any, $endsWith, $equal, $includes, $startsWith } from './boolean.js'
import { $fact, type Fact } from './input.js'
import { $from, type From } from './input.js'
import { $modulo } from './number.js'

import { LogicObj } from '../../test/logic.type.js'
import { AbObj } from '../../test/string.type.js'
import { $policy } from '../engine/policy.js'
import type { ValueExpression, LiteralExpression } from '../engine/types.js'
import type { BooleanExpr, EndsWithExpr, IncludesExpr, NumberArrExpr, StartsWithExpr, StringExpr } from '../json/jsonexpr.type.js'

import { array, float, forAll, string, tuple } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { it, expect, describe, expectTypeOf } from 'vitest'

describe('startsWith', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: '1',
            b: '2',
        }
        const fact = $fact(AbObj, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $startsWith(x1, x2)
        const startsWith = $policy({ x1, x2, x3 })
        const result = startsWith.evaluate({ input })
        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": "1",
                "b": "2",
              },
            },
            "output": {
              "x1": "1",
              "x2": "2",
              "x3": false,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<AbObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: string; x2: string; x3: boolean }>()
        expect(startsWith.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(AbObj, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $startsWith(x1, x2)
        const startsWith = $policy({ x1, x2, x3 })
        forAll(arbitrary(AbObj), (input) => {
            const result = startsWith.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: result.output.x1.startsWith(result.output.x2) })
            expectTypeOf(result.input.input).toEqualTypeOf<AbObj>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: string; x2: string; x3: boolean }>()
        })
    })

    it('handles two strings', () => {
        const x1 = $startsWith('1', '2')
        const startsWith = $policy({ x1 })
        const result = startsWith.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": false,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: boolean }>()
        expect(startsWith.expr()).toMatchSnapshot()
    })

    it('handles any two strings', () => {
        forAll(tuple(string({ minLength: 1 }), string({ minLength: 1 })), ([a, b]) => {
            const x1 = $startsWith(a + b, a)
            const startsWith = $policy({ x1 })
            const result = startsWith.evaluate()
            expect(result.output.x1).toEqual(true)
        })
    })

    it('handles the types', () => {
        const fact = $fact(AbObj, 'input')

        const x1 = $startsWith('1', '2')
        expectTypeOf(x1).toEqualTypeOf<
            ValueExpression<boolean, [LiteralExpression<'1', StringExpr>, LiteralExpression<'2', StringExpr>], StartsWithExpr>
        >()

        const x2 = $startsWith($from(fact, '$.a'), '2')
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                boolean,
                [From<AbObj, string, [Fact<AbObj, 'input'>]>, LiteralExpression<'2', StringExpr>],
                StartsWithExpr
            >
        >()

        const x3 = $startsWith('2', $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<
                boolean,
                [LiteralExpression<'2', StringExpr>, From<AbObj, string, [Fact<AbObj, 'input'>]>],
                StartsWithExpr
            >
        >()
    })
})

describe('endsWith', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: '1',
            b: '2',
        }
        const fact = $fact(AbObj, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $endsWith(x1, x2)
        const endsWith = $policy({ x1, x2, x3 })
        const result = endsWith.evaluate({ input })
        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": "1",
                "b": "2",
              },
            },
            "output": {
              "x1": "1",
              "x2": "2",
              "x3": false,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<AbObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: string; x2: string; x3: boolean }>()
        expect(endsWith.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(AbObj, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $endsWith(x1, x2)
        const startsWith = $policy({ x1, x2, x3 })
        forAll(arbitrary(AbObj), (input) => {
            const result = startsWith.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: result.output.x1.endsWith(result.output.x2) })
            expectTypeOf(result.input.input).toEqualTypeOf<AbObj>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: string; x2: string; x3: boolean }>()
        })
    })

    it('handles two strings', () => {
        const x1 = $endsWith('1', '2')
        const startsWith = $policy({ x1 })
        const result = startsWith.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": false,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: boolean }>()
        expect(startsWith.expr()).toMatchSnapshot()
    })

    it('handles any two strings', () => {
        forAll(tuple(string({ minLength: 1 }), string({ minLength: 1 })), ([a, b]) => {
            const x1 = $endsWith(a + b, b)
            const startsWith = $policy({ x1 })
            const result = startsWith.evaluate()
            expect(result.output.x1).toEqual(true)
        })
    })

    it('handles the types', () => {
        const fact = $fact(AbObj, 'input')

        const x1 = $endsWith('1', '2')
        expectTypeOf(x1).toEqualTypeOf<
            ValueExpression<boolean, [LiteralExpression<'1', StringExpr>, LiteralExpression<'2', StringExpr>], EndsWithExpr>
        >()

        const x2 = $endsWith($from(fact, '$.a'), '2')
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                boolean,
                [From<AbObj, string, [Fact<AbObj, 'input'>]>, LiteralExpression<'2', StringExpr>],
                EndsWithExpr
            >
        >()

        const x3 = $endsWith('2', $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<
                boolean,
                [LiteralExpression<'2', StringExpr>, From<AbObj, string, [Fact<AbObj, 'input'>]>],
                EndsWithExpr
            >
        >()
    })
})

describe('includes', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: '1',
            b: '2',
        }
        const fact = $fact(AbObj, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $includes(x1, x2)
        const endsWith = $policy({ x1, x2, x3 })
        const result = endsWith.evaluate({ input })
        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": "1",
                "b": "2",
              },
            },
            "output": {
              "x1": "1",
              "x2": "2",
              "x3": false,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<AbObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: string; x2: string; x3: boolean }>()
        expect(endsWith.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(AbObj, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $includes(x1, x2)
        const startsWith = $policy({ x1, x2, x3 })
        forAll(arbitrary(AbObj), (input) => {
            const result = startsWith.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: result.output.x1.includes(result.output.x2) })
            expectTypeOf(result.input.input).toEqualTypeOf<AbObj>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: string; x2: string; x3: boolean }>()
        })
    })

    it('handles two strings', () => {
        const x1 = $includes('1', '2')
        const startsWith = $policy({ x1 })
        const result = startsWith.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": false,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: boolean }>()
        expect(startsWith.expr()).toMatchSnapshot()
    })

    it('handles any two strings', () => {
        forAll(tuple(string({ minLength: 1 }), string({ minLength: 1 })), ([a, b]) => {
            const x1 = $includes(a + b, b)
            const startsWith = $policy({ x1 })
            const result = startsWith.evaluate()
            expect(result.output.x1).toEqual(true)
        })
    })

    it('handles the types', () => {
        const fact = $fact(AbObj, 'input')

        const x1 = $includes('1', '2')
        expectTypeOf(x1).toEqualTypeOf<
            ValueExpression<boolean, [LiteralExpression<'1', StringExpr>, LiteralExpression<'2', StringExpr>], IncludesExpr>
        >()

        const x2 = $includes($from(fact, '$.a'), '2')
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                boolean,
                [From<AbObj, string, [Fact<AbObj, 'input'>]>, LiteralExpression<'2', StringExpr>],
                IncludesExpr
            >
        >()

        const x3 = $includes('2', $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<
                boolean,
                [LiteralExpression<'2', StringExpr>, From<AbObj, string, [Fact<AbObj, 'input'>]>],
                IncludesExpr
            >
        >()
    })
})

describe('all', () => {
    it('handles a simple schema case', () => {
        const input = {
            c: true,
            a: 1,
            b: 2,
            d: [
                { a: true, b: false },
                { a: false, b: true },
            ],
            e: true,
        }
        const fact = $fact(LogicObj, 'input')
        const x1 = $from(fact, '$.d[*].a')
        const x2 = $from(fact, '$.d[*].b')
        const x3 = $all(x1, (x) => x)
        const hof = $policy({ x1, x2, x3 })
        const result = hof.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
                "c": true,
                "d": [
                  {
                    "a": true,
                    "b": false,
                  },
                  {
                    "a": false,
                    "b": true,
                  },
                ],
                "e": true,
              },
            },
            "output": {
              "x1": [
                true,
                false,
              ],
              "x2": [
                false,
                true,
              ],
              "x3": false,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: boolean[]; x2: boolean[]; x3: boolean }>()
        expect(hof.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(LogicObj, 'input')
        const x1 = $from(fact, '$.d[*].a')
        const x2 = $from(fact, '$.d[*].b')
        const d = $from(fact, '$.d')
        const x3 = $all(x1, (x) => $equal(true, x))
        const x4 = $all(x2, (x) => $equal(false, x))
        const x5 = $all(d, (x) => x('$.b'))
        const hof = $policy({ x1, x2, x3, x4, x5 })
        forAll(arbitrary(LogicObj), (input) => {
            const result = hof.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({
                x1: input.d.map((a) => a.a),
                x2: input.d.map((a) => a.b),
                x3: input.d.every((a) => a.a),
                x4: input.d.every((a) => !a.b),
                x5: input.d.every((a) => a.b),
            })
            expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
            expectTypeOf(result.output).toEqualTypeOf<{
                x1: boolean[]
                x2: boolean[]
                x3: boolean
                x4: boolean
                x5: boolean
            }>()
        })
    })

    it('handles any booleans', () => {
        forAll(array(float()), (xs) => {
            const x1 = $all(xs, (x) => $equal($modulo(x, 2), 1))
            const hof = $policy({ x1 })
            const result = hof.evaluate()
            expect(result.output.x1).toEqual(xs.every((x) => x % 2 === 1))
        })
    })

    it('handles the types', () => {
        const fact = $fact(LogicObj, 'input')

        const x1 = $all([1, 2], (x) => $equal(x, 1))
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<boolean, [LiteralExpression<number[], NumberArrExpr>], BooleanExpr>>()

        const a = $from(fact, '$.d')
        const x2 = $all(a, (x) => $equal(x, 1))
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                boolean,
                [
                    From<
                        LogicObj,
                        {
                            a: boolean
                            b: boolean
                        }[],
                        [Fact<LogicObj, 'input'>]
                    >,
                ],
                BooleanExpr
            >
        >()

        const ba = $from(fact, '$.b..a')
        const x3 = $all(ba, (x) => $equal(x, 1))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<boolean, [From<LogicObj, never[], [Fact<LogicObj, 'input'>]>], BooleanExpr>
        >()
    })
})

describe('any', () => {
    it('handles a simple schema case', () => {
        const input = {
            c: true,
            a: 1,
            b: 2,
            d: [
                { a: true, b: false },
                { a: false, b: true },
            ],
            e: true,
        }
        const fact = $fact(LogicObj, 'input')
        const x1 = $from(fact, '$.d[*].a')
        const x2 = $from(fact, '$.d[*].b')
        const x3 = $any(x1, (x) => x)
        const hof = $policy({ x1, x2, x3 })
        const result = hof.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
                "c": true,
                "d": [
                  {
                    "a": true,
                    "b": false,
                  },
                  {
                    "a": false,
                    "b": true,
                  },
                ],
                "e": true,
              },
            },
            "output": {
              "x1": [
                true,
                false,
              ],
              "x2": [
                false,
                true,
              ],
              "x3": true,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: boolean[]; x2: boolean[]; x3: boolean }>()
        expect(hof.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(LogicObj, 'input')
        const x1 = $from(fact, '$.d[*].a')
        const x2 = $from(fact, '$.d[*].b')
        const d = $from(fact, '$.d')
        const x3 = $any(x1, (x) => $equal(true, x))
        const x4 = $any(x2, (x) => $equal(false, x))
        const x5 = $any(d, (x) => x('$.b'))
        const hof = $policy({ x1, x2, x3, x4, x5 })
        forAll(arbitrary(LogicObj), (input) => {
            const result = hof.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({
                x1: input.d.map((a) => a.a),
                x2: input.d.map((a) => a.b),
                x3: input.d.some((a) => a.a),
                x4: input.d.some((a) => !a.b),
                x5: input.d.some((a) => a.b),
            })
            expectTypeOf(result.input.input).toEqualTypeOf<LogicObj>()
            expectTypeOf(result.output).toEqualTypeOf<{
                x1: boolean[]
                x2: boolean[]
                x3: boolean
                x4: boolean
                x5: boolean
            }>()
        })
    })

    it('handles any booleans', () => {
        forAll(array(float()), (xs) => {
            const x1 = $any(xs, (x) => $equal($modulo(x, 2), 1))
            const hof = $policy({ x1 })
            const result = hof.evaluate()
            expect(result.output.x1).toEqual(xs.some((x) => x % 2 === 1))
        })
    })

    it('handles the types', () => {
        const fact = $fact(LogicObj, 'input')

        const x1 = $any([1, 2], (x) => $equal(x, 1))
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<boolean, [LiteralExpression<number[], NumberArrExpr>], BooleanExpr>>()

        const a = $from(fact, '$.d')
        const x2 = $any(a, (x) => $equal(x, 1))
        expectTypeOf(x2).toEqualTypeOf<
            ValueExpression<
                boolean,
                [
                    From<
                        LogicObj,
                        {
                            a: boolean
                            b: boolean
                        }[],
                        [Fact<LogicObj, 'input'>]
                    >,
                ],
                BooleanExpr
            >
        >()

        const ba = $from(fact, '$.b..a')
        const x3 = $any(ba, (x) => $equal(x, 1))
        expectTypeOf(x3).toEqualTypeOf<
            ValueExpression<boolean, [From<LogicObj, never[], [Fact<LogicObj, 'input'>]>], BooleanExpr>
        >()
    })
})
