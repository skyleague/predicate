import { expectTypeOf, it } from 'vitest'
import { LogicObj } from '../../test/logic.type.js'
import { AbObj } from '../../test/string.type.js'
import { $any, $equal } from '../expressions/boolean.js'
import { $fact, $from, type Fact } from '../expressions/input.js'
import { $concat } from '../expressions/string.js'
import type { BooleanExpr, ConcatExpr } from '../json/jsonexpr.type.js'
import { $policy, type Policy } from './policy.js'
import type { ValueExpression } from './types.js'

it('handles the types', () => {
    const fact = $fact(LogicObj, 'input')
    const a = $from(fact, '$.d')
    const x = $any(a, (x) => $equal(x, 1))

    expectTypeOf(x).toEqualTypeOf<
        ValueExpression<
            boolean,
            [
                {
                    a: boolean
                    b: boolean
                }[],
            ],
            [Fact<LogicObj, 'input'>],
            BooleanExpr
        >
    >()

    const fact2 = $fact(AbObj, 'input2')
    const x2 = $concat($from(fact2, '$.a'), '2')
    expectTypeOf(x2).toEqualTypeOf<ValueExpression<string, [string, '2', ...string[]], [Fact<AbObj, 'input2'>], ConcatExpr>>()

    const policy = $policy({ x, x2 })

    expectTypeOf(policy).toEqualTypeOf<
        Policy<
            {
                input: LogicObj
                input2: AbObj
            },
            {
                x: boolean
                x2: string
            }
        >
    >()
})
