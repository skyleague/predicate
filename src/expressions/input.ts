import { inspect } from 'node:util'
import { JSONPath, type JSONPathValue } from '@skyleague/jsonpath'
import type { Schema } from '@skyleague/therefore'
import type { DefinitionType, FactExpression, InferExpressionType, InputExpression, LiteralExpression } from '../engine/types.js'
import type { FromExpr } from '../json/jsonexpr.type.js'

// biome-ignore lint/suspicious/noExplicitAny: this is needed for greedy matching
export interface Fact<T = any, Name extends string = string> extends FactExpression<T> {
    name: Name
    dependsOn: []
    _type: 'fact'
}

export function $fact<T, Name extends string>(
    schema: {
        safeParse: (x: unknown) =>
            | {
                  success: true
                  data: T
                  error?: never
              }
            | {
                  success: false
                  error: unknown
                  data?: never
              }
    },
    name: Name,
): Fact<T, Name>
export function $fact<T, Name extends string>(schema: Pick<Schema<T>, 'schema' | 'is'>, name: Name): Fact<T, Name>
export function $fact<T, Name extends string>(
    schema:
        | Pick<Schema<T>, 'schema' | 'is'>
        | {
              safeParse: (x: unknown) =>
                  | {
                        success: true
                        data: T
                        error?: never
                    }
                  | {
                        success: false
                        error: unknown
                        data?: never
                    }
          },
    name: Name,
): Fact<T, Name> {
    if ('safeParse' in schema) {
        return {
            _type: 'fact',
            dependsOn: [],
            name: name,
            fn: ((_: unknown, ctx: { input: Record<Name, T> }) => {
                return ctx.input[name]
            }) as Fact<T, Name>['fn'],
            expr: (definition: DefinitionType): InferExpressionType<T> => {
                if (definition === 'definition') {
                    throw new Error('Cannot infer definition for fact with zod schema')
                }
                return { fact: name.toString() } as unknown as InferExpressionType<T>
            },
            [inspect.custom]() {
                return `$fact({schema: <JSONSchema>}, "${name}")`
            },
        }
    }
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
export interface From<I, O, F extends Fact> extends InputExpression<O, I, [F], FromExpr> {
    _type: 'value'
}

export function $from<T, Name extends string>(fact: Fact<T, Name>): From<T, JSONPathValue<T, '$'>, Fact<T, Name>>
export function $from<T, P extends string, Name extends string>(
    fact: Fact<T, Name>,
    path: P,
): From<T, JSONPathValue<T, P>, Fact<T, Name>>
export function $from<T, P extends string, Name extends string>(
    fact: Fact<T, Name>,
    path: P = '$' as P,
): From<T, JSONPathValue<T, P>, Fact<T, Name>> {
    return {
        _type: 'value',
        dependsOn: [fact],
        fn: ((_: unknown, ctx: { input: Record<Name, T> }) => JSONPath.get(ctx.input[fact.name], path)) as From<
            T,
            JSONPathValue<T, P>,
            Fact<T, Name>
        >['fn'],
        expr: () => ({ from: [fact.name, path.toString()] as const }),
        [inspect.custom]() {
            return `$from(${fact[inspect.custom]?.() ?? `"${fact.name}"`}${path === '$' ? '' : `, "${path}"`})`
        },
    } as unknown as From<T, JSONPathValue<T, P>, Fact<T, Name>>
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
