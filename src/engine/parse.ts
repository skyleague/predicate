import { $policy } from './policy.js'
import type { Expression } from './types.js'

import { $value } from '../expressions/higher-order-fn.js'
import * as expressions from '../expressions/index.js'
import { $fact, $from, $literal, type Fact } from '../expressions/input.js'
import { JSONExprDefinition } from '../json/jsonexpr.type.js'
import type { FromExpr, JSONExpr, ValueItemExpr } from '../json/jsonexpr.type.js'

import { isDefined, keysOf } from '@skyleague/axioms'

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
        return $policy<any>(
            Object.fromEntries(
                Object.entries(definition.output)
                    .filter(([_, v]) => isDefined(v))
                    .map(([k, v]) => [k, parseExpr({ definition, expr: v!, inputs, operators: builtin })])
            )
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
    } else if (op === 'from') {
        const _expr = expr as FromExpr
        if (inputs[_expr.from[0]] === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            inputs[_expr.from[0]] = $fact({ schema: definition.input?.[_expr.from[0]] } as any, _expr.from[0])
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return $from(inputs[_expr.from[0]] as any, _expr.from[1])
    } else if (op !== undefined && operators[op] !== undefined) {
        const _expr = expr as Record<string, JSONExpr[]>
        const _op = operators[op]
        const _args = _expr[op]?.map((x) => parseExpr({ definition, expr: x, inputs, operators })) ?? []
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return ((_op as any | undefined)?.parse ?? _op)(..._args)
    }
    throw new Error('Not implemented')
}
