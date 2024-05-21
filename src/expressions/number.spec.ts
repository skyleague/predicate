import { $fact, $from, type Fact } from './input.js'
import { $add, $divide, $modulo, $multiply, $subtract } from './number.js'

import { Arithmetic } from '../../test/arithmatic.type.js'
import { $policy } from '../engine/policy.js'
import type { ValueExpression } from '../engine/types.js'
import type { AddExpr, DivExpr, ModExpr, MulExpr, SubExpr } from '../json/jsonexpr.type.js'

import { float, forAll, integer, tuple } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { describe, expect, expectTypeOf, it } from 'vitest'

describe('add', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: 1,
            b: 2,
        }
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $add(x1, x2)
        const adder = $policy({ x1, x2, x3 })
        const result = adder.evaluate({ input })

        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
              },
            },
            "output": {
              "x1": 1,
              "x2": 2,
              "x3": 3,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        expect(adder.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $add(x1, x2)
        const adder = $policy({ x1, x2, x3 })
        forAll(arbitrary(Arithmetic), (input) => {
            const result = adder.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: input.a + input.b })
            expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        })
    })

    it('handles two numbers', () => {
        const x1 = $add(1, 2)
        const adder = $policy({ x1 })
        const result = adder.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": 3,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number }>()
        expect(adder.expr()).toMatchSnapshot()
    })

    it('handles any two numbers', () => {
        forAll(tuple(float(), float()), ([a, b]) => {
            const x1 = $add(a, b)
            const adder = $policy({ x1 })
            const result = adder.evaluate()
            expect(result.output.x1).toEqual(a + b)
        })
    })

    it('handles the types', () => {
        const fact = $fact(Arithmetic, 'input')

        const x1 = $add(1, 2)
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number, [1, 2], never, AddExpr>>()

        const x2 = $add($from(fact, '$.a'), 2)
        expectTypeOf(x2).toEqualTypeOf<ValueExpression<number, [number, 2], [Fact<Arithmetic, 'input'>], AddExpr>>()

        const x3 = $add(2, $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<ValueExpression<number, [2, number], [Fact<Arithmetic, 'input'>], AddExpr>>()
    })
})

describe('subtract', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: 1,
            b: 2,
        }
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $subtract(x1, x2)
        const subs = $policy({ x1, x2, x3 })
        const result = subs.evaluate({ input })
        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
              },
            },
            "output": {
              "x1": 1,
              "x2": 2,
              "x3": -1,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        expect(subs.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $subtract(x1, x2)
        const subs = $policy({ x1, x2, x3 })
        forAll(arbitrary(Arithmetic), (input) => {
            const result = subs.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: input.a - input.b })
            expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        })
    })

    it('handles two numbers', () => {
        const x1 = $subtract(1, 2)
        const subs = $policy({ x1 })
        const result = subs.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": -1,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number }>()
        expect(subs.expr()).toMatchSnapshot()
    })

    it('handles any two numbers', () => {
        forAll(tuple(float(), float()), ([a, b]) => {
            const x1 = $subtract(a, b)
            const subs = $policy({ x1 })
            const result = subs.evaluate()

            expectTypeOf(x1).toEqualTypeOf<ValueExpression<number, [number, number], never, SubExpr>>()
            expect(result.output.x1).toEqual(a - b)
        })
    })

    it('handles the types', () => {
        const fact = $fact(Arithmetic, 'input')

        const x1 = $subtract(1, 2)
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number, [1, 2], never, SubExpr>>()

        const x2 = $subtract($from(fact, '$.a'), 2)
        expectTypeOf(x2).toEqualTypeOf<ValueExpression<number, [number, 2], [Fact<Arithmetic, 'input'>], SubExpr>>()

        const x3 = $subtract(2, $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<ValueExpression<number, [2, number], [Fact<Arithmetic, 'input'>], SubExpr>>()
    })
})

describe('multiply', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: 1,
            b: 2,
        }
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $multiply(x1, x2)
        const mult = $policy({ x1, x2, x3 })
        const result = mult.evaluate({ input })
        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
              },
            },
            "output": {
              "x1": 1,
              "x2": 2,
              "x3": 2,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        expect(mult.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $multiply(x1, x2)
        const mult = $policy({ x1, x2, x3 })
        forAll(arbitrary(Arithmetic), (input) => {
            const result = mult.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: input.a * input.b })
            expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        })
    })

    it('handles two numbers', () => {
        const x1 = $multiply(1, 2)
        const mult = $policy({ x1 })
        const result = mult.evaluate()
        expect(result).toMatchInlineSnapshot(`
        {
          "input": undefined,
          "output": {
            "x1": 2,
          },
        }
      `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number }>()
        expect(mult.expr()).toMatchSnapshot()
    })

    it('handles any two numbers', () => {
        forAll(tuple(float(), float()), ([a, b]) => {
            const x1 = $multiply(a, b)
            const mult = $policy({ x1 })
            const result = mult.evaluate()
            expect(result.output.x1).toEqual(a * b)
        })
    })

    it('handles the types', () => {
        const fact = $fact(Arithmetic, 'input')

        const x1 = $multiply(1, 2)
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number, [1, 2], never, MulExpr>>()

        const x2 = $multiply($from(fact, '$.a'), 2)
        expectTypeOf(x2).toEqualTypeOf<ValueExpression<number, [number, 2], [Fact<Arithmetic, 'input'>], MulExpr>>()

        const x3 = $multiply(2, $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<ValueExpression<number, [2, number], [Fact<Arithmetic, 'input'>], MulExpr>>()
    })
})
describe('divide', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: 1,
            b: 2,
        }
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $divide(x1, x2)
        const div = $policy({ x1, x2, x3 })
        const result = div.evaluate({ input })
        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
              },
            },
            "output": {
              "x1": 1,
              "x2": 2,
              "x3": 0.5,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        expect(div.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $divide(x1, x2)
        const div = $policy({ x1, x2, x3 })
        forAll(arbitrary(Arithmetic), (input) => {
            const result = div.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: input.a / input.b })
            expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        })
    })

    it('handles two numbers', () => {
        const x1 = $divide(1, 2)
        const div = $policy({ x1 })
        const result = div.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": 0.5,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number }>()
        expect(div.expr()).toMatchSnapshot()
    })

    it('handles any two numbers', () => {
        forAll(tuple(float(), float()), ([a, b]) => {
            const x1 = $divide(a, b)
            const div = $policy({ x1 })
            const result = div.evaluate()
            expect(result.output.x1).toEqual(a / b)
        })
    })

    it('handles the types', () => {
        const fact = $fact(Arithmetic, 'input')

        const x1 = $divide(1, 2)
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number, [1, 2], never, DivExpr>>()

        const x2 = $divide($from(fact, '$.a'), 2)
        expectTypeOf(x2).toEqualTypeOf<ValueExpression<number, [number, 2], [Fact<Arithmetic, 'input'>], DivExpr>>()

        const x3 = $divide(2, $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<ValueExpression<number, [2, number], [Fact<Arithmetic, 'input'>], DivExpr>>()
    })
})

describe('mod', () => {
    it('handles a simple schema case', () => {
        const input = {
            a: 1,
            b: 2,
        }
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $modulo(x1, x2)
        const div = $policy({ x1, x2, x3 })
        const result = div.evaluate({ input })
        expect(result).toMatchInlineSnapshot(`
          {
            "input": {
              "input": {
                "a": 1,
                "b": 2,
              },
            },
            "output": {
              "x1": 1,
              "x2": 2,
              "x3": 1,
            },
          }
        `)
        expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        expect(div.expr()).toMatchSnapshot()
    })

    it('handles any simple schema case', () => {
        const fact = $fact(Arithmetic, 'input')
        const x1 = $from(fact, '$.a')
        const x2 = $from(fact, '$.b')
        const x3 = $modulo(x1, x2)
        const div = $policy({ x1, x2, x3 })
        forAll(arbitrary(Arithmetic), (input) => {
            const result = div.evaluate({ input })
            expect(result.input).toEqual({ input })
            expect(result.output).toEqual({ x1: input.a, x2: input.b, x3: input.a % input.b })
            expectTypeOf(result.input.input).toEqualTypeOf<Arithmetic>()
            expectTypeOf(result.output).toEqualTypeOf<{ x1: number; x2: number; x3: number }>()
        })
    })

    it('handles two numbers', () => {
        const x1 = $modulo(1, 2)
        const div = $policy({ x1 })
        const result = div.evaluate()
        expect(result).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "x1": 1,
            },
          }
        `)
        expectTypeOf(result.output).toEqualTypeOf<{ x1: number }>()
        expect(div.expr()).toMatchSnapshot()
    })

    it('handles any two numbers', () => {
        forAll(tuple(integer(), integer()), ([a, b]) => {
            const x1 = $modulo(a, b)
            const div = $policy({ x1 })
            const result = div.evaluate()
            expect(result.output.x1).toEqual(a % b)
        })
    })

    it('handles the types', () => {
        const fact = $fact(Arithmetic, 'input')

        const x1 = $modulo(1, 2)
        expectTypeOf(x1).toEqualTypeOf<ValueExpression<number, [1, 2], never, ModExpr>>()

        const x2 = $modulo($from(fact, '$.a'), 2)
        expectTypeOf(x2).toEqualTypeOf<ValueExpression<number, [number, 2], [Fact<Arithmetic, 'input'>], ModExpr>>()

        const x3 = $modulo(2, $from(fact, '$.b'))
        expectTypeOf(x3).toEqualTypeOf<ValueExpression<number, [2, number], [Fact<Arithmetic, 'input'>], ModExpr>>()
    })
})
