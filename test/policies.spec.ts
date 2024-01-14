import { valueExpression } from './arbitraries.js'

import { parseJSONExpression } from '../src/engine/parse.js'
import { $policy, type Policy } from '../src/engine/policy.js'
import type { ValueExpression, LiteralExpression } from '../src/engine/types.js'
import { $startsWith } from '../src/expressions/boolean.js'
import { $map } from '../src/expressions/higher-order-fn.js'
import { JSONExprDefinition, type BooleanExpr, type StringArrExpr } from '../src/json/jsonexpr.type.js'

import { forAll } from '@skyleague/axioms'
import { describe, it, expect } from 'vitest'

describe('arbitrary', () => {
    it('input is properly defined and loaded', () => {
        forAll(
            valueExpression,
            ([value, expr, input]) => {
                const policy = $policy({ expr }) as unknown as Policy<any, any>
                expect(policy.evaluate(input)).toEqual({ input, output: { expr: value } })
                const serialized = policy.expr()
                expect(JSONExprDefinition.is(serialized)).toBe(true)

                const parsed = parseJSONExpression(serialized) as unknown as Policy<any, any>
                expect(parsed?.expr()).toEqual(serialized)
                expect(parsed?.evaluate(input)).toEqual({ input, output: { expr: value } })
            },
            {
                tests: 100000,
            }
        )
    })
})

describe('any string starts with', () => {
    const inputs = ['foo', 'bar', 'baz']
    const startedWith: ValueExpression<boolean[], [LiteralExpression<string[], StringArrExpr>], BooleanExpr> = $map(inputs, (x) =>
        $startsWith(x, 'foo')
    )
    const startsWithFoo = $policy({ startedWith })

    it('handles a simple schema case', () => {
        expect(startsWithFoo.evaluate()).toMatchInlineSnapshot(`
          {
            "input": undefined,
            "output": {
              "startedWith": [
                true,
                false,
                false,
              ],
            },
          }
        `)
    })
})
