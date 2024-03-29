/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */
import type { ValidateFunction } from 'ajv'
import { ValidationError } from 'ajv'

export interface LogicObj {
    c: boolean
    a: string | boolean | number
    b: string | boolean | number
    d: {
        a: boolean
        b: boolean
    }[]
    e: boolean
}

export const LogicObj = {
    validate: (await import('./schemas/logic-obj.schema.js')).validate as ValidateFunction<LogicObj>,
    get schema() {
        return LogicObj.validate.schema
    },
    get errors() {
        return LogicObj.validate.errors ?? undefined
    },
    is: (o: unknown): o is LogicObj => LogicObj.validate(o) === true,
    assert: (o: unknown) => {
        if (!LogicObj.validate(o)) {
            throw new ValidationError(LogicObj.errors ?? [])
        }
    },
} as const
