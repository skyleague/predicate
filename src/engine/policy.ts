import { collect, stack } from '@skyleague/axioms'
import type { IsEmptyObject, Simplify } from '@skyleague/axioms/types'
import packageJSON from '../../package.json' with { type: 'json' }
import type { FactsFomExprs } from './operator.js'
import type { Expression, ExpressionReturnType } from './types.js'

const { version } = packageJSON

export class EvaluationContext {
    public evaluated = new WeakMap<object, unknown>()
    public state: Partial<Record<PropertyKey, unknown>> = {}
    public input: Record<string, unknown> = {}
    public scope: unknown = {}
    public stack: (readonly [EvaluationContext['evaluated'], EvaluationContext['state'], unknown])[]

    public constructor(input: Record<string, unknown>) {
        this.input = input
        this.stack = [[this.evaluated, this.state, this.scope]]
    }

    public evaluate<O>(expr: Expression<O>): O {
        if (this.evaluated.has(expr)) {
            return this.evaluated.get(expr) as O
        }

        const input = expr.dependsOn.map((d) => this.evaluate(d))

        const result = expr.fn(input, this)
        this.evaluated.set(expr, result)
        return result
    }

    public withScope<T>(scope: unknown, fn: () => T) {
        this.push(scope)
        const result = fn()
        this.pop()
        return result
    }

    protected push(scope: unknown) {
        const top = [new WeakMap<object, unknown>(), {}, scope] as const
        this.stack.push(top)
        this.evaluated = top[0]
        this.state = top[1]
        this.scope = top[2]
    }

    protected pop() {
        this.stack.pop()
        const top = this.stack.at(-1) ?? [this.evaluated, this.state, this.scope]
        this.evaluated = top[0]
        this.state = top[1]
        this.scope = top[2]
    }
}

export interface _EvaluationContext {
    evaluated: WeakMap<object, unknown>
    state: Partial<Record<PropertyKey, unknown>>
    stack: [_EvaluationContext['evaluated'], _EvaluationContext['state'], unknown][]
    scope: unknown
    evaluate<T>(expr: Expression<T>): T
    withScope: <T>(y: unknown, fn: () => T) => T
}

function* collapseExpression(root: Expression[], seen = new WeakSet()) {
    const nodes = stack(root)
    for (const n of nodes) {
        if (!seen.has(n)) {
            yield n
            nodes.push(n.dependsOn)
            seen.add(n)
        }
    }
}
type InferFactName<Expr, k> = Expr extends { name: string } ? Expr['name'] : k

type FilterFactExpressions<Facts, K extends keyof Facts = keyof Facts> = Facts[K] extends {
    _type: 'fact'
}
    ? InferFactName<Facts[K], K>
    : never

type _InputFromName<Names extends PropertyKey, Facts> = {
    [K in Names]: ExpressionReturnType<Extract<Facts[keyof Facts], { name: K }>>
}
type _InputFromExpressions<Facts> = _InputFromName<
    FilterFactExpressions<Facts> extends PropertyKey ? FilterFactExpressions<Facts> : never,
    Facts
>

type _FactsFomExprs<Facts> = Facts extends unknown[] ? Facts[number] : Facts
export type InputFromExpressions<Facts extends Record<string, unknown>> = Simplify<
    _InputFromExpressions<{ [K in keyof Facts as FilterFactExpressions<Facts, K>]: Facts[K] }> &
        _InputFromExpressions<{ [K in keyof Facts]: _FactsFomExprs<FactsFomExprs<Facts[K]>> }>
>

export type OutputFromFacts<Facts extends Record<string, unknown>> = Simplify<{
    [k in keyof Facts]: ExpressionReturnType<Facts[k]>
}>

export interface Policy<I, O> {
    evaluate: IsEmptyObject<I> extends true ? () => { input: I; output: O } : (x: I) => { input: I; output: O }
    expr: () => unknown
}

export function $policy<Facts extends Record<string, Expression>>(
    expressions: Facts,
): Policy<InputFromExpressions<Facts>, OutputFromFacts<Facts>> {
    const facts = Object.entries(expressions).map(([name, e]) => {
        if (e.name === undefined) {
            return Object.assign(e, { name })
        }
        return e
    })

    const allNodes = collect(collapseExpression(facts))
    const inputNodes = allNodes.filter(
        (f: (typeof allNodes)[number]): f is (typeof allNodes)[number] & { name: string } =>
            f._type === 'fact' && f.name !== undefined,
    )
    const outputNodes = allNodes.filter((f) => f._type !== 'fact' && f.name !== undefined)

    const properties = Object.fromEntries(inputNodes.map((e) => [e.name, e.expr('definition')]))
    const outputExpression = Object.fromEntries(outputNodes.map((f) => [f.name, f.expr('expression')]))
    return {
        evaluate: ((input: Record<string, unknown>) => {
            const ctx = new EvaluationContext(input)

            for (const fact of facts) {
                const result = ctx.evaluate(fact)
                if (fact.name !== undefined) {
                    ctx.state[fact.name] = result
                }
            }

            return { input: input, output: ctx.state }
        }) as Policy<InputFromExpressions<Facts>, OutputFromFacts<Facts>>['evaluate'],
        expr: () => {
            const input = properties
            return {
                meta: {
                    version,
                },
                input,
                output: outputExpression,
            }
        },
    }
}
