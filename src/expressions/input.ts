import type {
    FactExpression,
    DefinitionType,
    Expression,
    InputExpression,
    InferExpressionType,
    LiteralExpression,
} from '../engine/types.js'
import type { FromExpr } from '../json/jsonexpr.type.js'

import { type JSONPathValue, JSONPath } from '@skyleague/jsonpath'
import type { Schema } from '@skyleague/therefore'

import { inspect } from 'node:util'

export interface Fact<T, Name extends string> extends FactExpression<T> {
    name: Name
    dependsOn: []
    _type: 'fact'
}

export function $fact<T, Name extends string>(schema: Pick<Schema<T>, 'schema' | 'is'>, name: Name): Fact<T, Name> {
    return {
        _type: 'fact',
        dependsOn: [],
        name: name,
        fn: ((_: unknown, ctx: { input: Record<Name, T> }) => {
            return ctx.input[name]
        }) as Fact<T, Name>['fn'],
        expr: (definition: DefinitionType) =>
            (definition === 'definition' ? schema.schema : { fact: name.toString() }) as InferExpressionType<T>,
        [inspect.custom]() {
            return `$fact({schema: ${JSON.stringify(schema.schema)}}, "${name}")`
        },
    }
}
export interface From<I, O, DependsOn extends Expression[]> extends InputExpression<O, I, DependsOn, FromExpr> {
    _type: 'value'
}

export function $from<T, Name extends string>(fact: Fact<T, Name>): From<T, JSONPathValue<T, '$'>, [Fact<T, Name>]>
export function $from<T, P extends string, Name extends string>(
    fact: Fact<T, Name>,
    path: P
): From<T, JSONPathValue<T, P>, [Fact<T, Name>]>
export function $from<T, P extends string, Name extends string>(
    fact: Fact<T, Name>,
    path: P = '$' as P
): From<T, JSONPathValue<T, P>, [Fact<T, Name>]> {
    return {
        _type: 'value',
        dependsOn: [fact],
        fn: ((_: unknown, ctx: { input: Record<Name, T> }) => JSONPath.get(ctx.input[fact.name], path)) as From<
            T,
            JSONPathValue<T, P>,
            [Fact<T, Name>]
        >['fn'],
        expr: (_definition) => ({ from: [fact.name, path.toString()] as const }),
        [inspect.custom]() {
            return `$from(${fact[inspect.custom]?.() ?? `"${fact.name}"`}${path === '$' ? '' : `, "${path}"`})`
        },
    }
}

export function $literal<O>(x: O): LiteralExpression<O> {
    return {
        fn: () => x,
        dependsOn: [],
        expr: () => x as InferExpressionType<O>,
        _type: 'literal',
        [inspect.custom]() {
            return `$literal(${inspect(x)})`
        },
    }
}
