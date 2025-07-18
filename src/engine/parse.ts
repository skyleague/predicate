import { isDefined, keysOf } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

import { $value } from '../expressions/higher-order-fn.js'
import * as expressions from '../expressions/index.js'
import { $fact, $from, $literal, type Fact } from '../expressions/input.js'
import type { FromExpr, JSONExpr, ValueItemExpr } from '../json/jsonexpr.type.js'
import { JSONExprDefinition } from '../json/jsonexpr.type.js'
import { $policy } from './policy.js'
import type { Expression } from './types.js'

const builtin = (() => {
    const ops: Record<string, unknown> = {}
    for (const expression of Object.values(expressions)) {
        if ('operator' in expression) {
            ops[expression.operator] = expression
        }
    }
    return ops
})()

export function parseJSONExpression(definition: JSONExprDefinition | unknown) {
    if (JSONExprDefinition.is(definition)) {
        const inputs = {}
        return $policy(
            Object.fromEntries(
                Object.entries(definition.output)
                    .filter(([_, v]) => isDefined(v))
                    // biome-ignore lint/style/noNonNullAssertion: we filtered out undefined values
                    .map(([k, v]) => [k, parseExpr({ definition, expr: v!, inputs, operators: builtin })]),
            ),
        )
    }
    return undefined
}

export function parseExpr({
    definition,
    expr,
    inputs,
    operators,
}: {
    definition: JSONExprDefinition
    expr: ValueItemExpr | JSONExpr
    inputs: Record<string, Fact<unknown, string>>
    operators: Record<string, unknown>
}): Expression {
    if (typeof expr === 'number' || typeof expr === 'boolean' || typeof expr === 'string') {
        return $literal(expr)
    }
    if (Array.isArray(expr)) {
        return $literal(expr)
    }
    const op = keysOf(expr)[0]
    if (op === 'value') {
        return $value()
    }
    if (op === 'from') {
        const _expr = expr as FromExpr
        if (inputs[_expr.from[0]] === undefined) {
            inputs[_expr.from[0]] = $fact({ schema: definition.input?.[_expr.from[0]] } as Schema<unknown>, _expr.from[0])
        }

        return $from(inputs[_expr.from[0]] as Fact<unknown, string>, _expr.from[1])
    }
    if (op !== undefined && operators[op] !== undefined) {
        const _expr = expr as Record<string, JSONExpr[]>
        const _op = operators[op]
        const _args = _expr[op]?.map((x) => parseExpr({ definition, expr: x, inputs, operators })) ?? []
        // biome-ignore lint/suspicious/noExplicitAny: any is necessary for the operator function
        return ((_op as any | undefined)?.parse ?? _op)(..._args)
    }
    throw new Error('Not implemented')
}
