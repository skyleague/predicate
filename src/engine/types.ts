import type { EvaluationContext } from './policy.js'

import { $literal } from '../expressions/input.js'
import type {
    BooleanArrExpr,
    BooleanExpr,
    JSONExpr,
    NumberArrExpr,
    NumberExpr,
    StringArrExpr,
    StringExpr,
    ValueItemExpr,
} from '../json/jsonexpr.type.js'

import { inspect } from 'node:util'
export type ExpressionType = 'fact' | 'value' | 'literal'

export type DefinitionType = 'definition' | 'expression'

export type InferExpressionType<T> = T extends readonly (infer U)[]
    ? U extends number
        ? NumberArrExpr
        : U extends string
          ? StringArrExpr
          : U extends boolean
            ? BooleanArrExpr
            : JSONExpr
    : T extends number
      ? NumberExpr
      : T extends string
        ? StringExpr
        : T extends boolean
          ? BooleanExpr
          : JSONExpr

export interface Expression<O = any, I = any, Expr extends JSONExpr | ValueItemExpr = InferExpressionType<O>> {
    _input?: I
    _output?: O
    _type?: string
    name?: PropertyKey
    dependsOn: Expression[]
    fn: (x: I, ctx: EvaluationContext) => O
    expr: (definition: DefinitionType) => Expr
    [inspect.custom]?(): string
}

export type ExpressionReturnType<E> = E extends Pick<Expression, 'fn'> ? ReturnType<E['fn']> : E

export interface LiteralExpression<O = any, Expr extends JSONExpr = InferExpressionType<O>> extends Expression<O, any, Expr> {
    dependsOn: []
    _type: 'literal'
}

export interface FactExpression<T, Expr extends JSONExpr = InferExpressionType<T>> extends Expression<T, unknown, Expr> {
    _type: 'fact'
}

export interface InputExpression<
    O,
    I,
    DependsOn extends Expression[],
    Expr extends JSONExpr | ValueItemExpr = InferExpressionType<O>,
> extends Expression<O, I, Expr> {
    dependsOn: DependsOn
    _type: 'value' | 'literal'
}

export type InputFromExpressions<Expr extends Expression[]> = {
    [k in keyof Expr]: ExpressionReturnType<Expr[k]>
}

export interface ValueExpression<O, DependsOn extends Expression[], Expr extends JSONExpr = InferExpressionType<O>>
    extends Expression<O, InputFromExpressions<DependsOn>, Expr> {
    dependsOn: DependsOn
    _type?: 'value'
}

export function fromLiteral<E>(x: E): AsExpression<E> {
    return (
        (typeof x === 'object' || typeof x === 'function') && x !== null && 'fn' in x && typeof x.fn === 'function'
            ? x
            : $literal(x)
    ) as E extends Expression ? E : LiteralExpression<E>
}

export type LiteralOr<T> = Expression<T> | T
export type LiteralOrExpressionsFrom<Exprs> = { [K in keyof Exprs]: AsExpression<Exprs[K]> }
export type AsExpression<E> = E extends Expression ? E : LiteralExpression<E>
export type ExpressionTypeOf<E> = E extends Expression<infer T> ? T : never
export type ExpressionTypeOfLiteral<E> = ExpressionTypeOf<AsExpression<E>>
