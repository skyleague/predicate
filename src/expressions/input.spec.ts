import { forAll, tuple } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { Arithmetic } from '../../test/arithmatic.type.js'
import { Person } from '../../test/person.type.js'
import { $policy } from '../engine/policy.js'
import { $fact, $from } from './input.js'
import { $add } from './number.js'

describe('fact', () => {
    it('simple single one is used as input', () => {
        const person = $fact(Person, 'person')
        const policy = $policy({ person })
        forAll(arbitrary(Person), (p) => {
            expect(policy.evaluate({ person: p }).input.person).toEqual(p)
        })

        expect(policy.expr()).toMatchInlineSnapshot(`
        {
          "input": {
            "person": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "additionalProperties": true,
              "properties": {
                "age": {
                  "type": "number",
                },
                "birthDate": {
                  "type": "string",
                },
                "firstName": {
                  "type": "string",
                },
                "lastName": {
                  "type": "string",
                },
              },
              "required": [
                "firstName",
                "lastName",
                "birthDate",
                "age",
              ],
              "title": "Person",
              "type": "object",
            },
          },
          "meta": {
            "version": "1.0.0",
          },
          "output": {},
        }
      `)
    })

    it('simple single one is used as input - zod', () => {
        const zodPerson = z.object({
            firstName: z.string(),
            lastName: z.string(),
            birthDate: z.string(),
            age: z.number(),
        })
        zodPerson.safeParse
        const person = $fact(zodPerson, 'person')
        const policy = $policy({ person })
        forAll(arbitrary(Person), (p) => {
            expect(policy.evaluate({ person: p }).input.person).toEqual(p)
        })

        expect(() => policy.expr()).toThrowErrorMatchingInlineSnapshot(
            '[Error: Cannot infer definition for fact with zod schema]',
        )
    })

    it('simple multiple is used as input', () => {
        const person = $fact(Person, 'person')
        const arithmetic = $fact(Arithmetic, 'arith')
        const a = $from(arithmetic, '$.a')
        const b = $from(arithmetic, '$.b')
        const ab = $add(a, b)

        const policy = $policy({ ab, person })

        forAll(tuple(arbitrary(Person), arbitrary(Arithmetic)), ([p, arith]) => {
            const evaluation = policy.evaluate({ person: p, arith: arith })
            expect(evaluation.input.person).toEqual(p)
            expect(evaluation.input.arith).toEqual(arith)
        })

        expect(policy.expr()).toMatchInlineSnapshot(`
          {
            "input": {
              "arith": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "additionalProperties": true,
                "properties": {
                  "a": {
                    "type": "number",
                  },
                  "b": {
                    "type": "number",
                  },
                },
                "required": [
                  "a",
                  "b",
                ],
                "title": "Arithmetic",
                "type": "object",
              },
              "person": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "additionalProperties": true,
                "properties": {
                  "age": {
                    "type": "number",
                  },
                  "birthDate": {
                    "type": "string",
                  },
                  "firstName": {
                    "type": "string",
                  },
                  "lastName": {
                    "type": "string",
                  },
                },
                "required": [
                  "firstName",
                  "lastName",
                  "birthDate",
                  "age",
                ],
                "title": "Person",
                "type": "object",
              },
            },
            "meta": {
              "version": "1.0.0",
            },
            "output": {
              "ab": {
                "+": [
                  {
                    "from": [
                      "arith",
                      "$.a",
                    ],
                  },
                  {
                    "from": [
                      "arith",
                      "$.b",
                    ],
                  },
                ],
              },
            },
          }
        `)
    })
})

describe('from', () => {
    it('simple single one is used as input', () => {
        const person = $fact(Person, 'person')
        const firstName = $from(person, '$.firstName')
        const policy = $policy({ person, firstName })
        forAll(arbitrary(Person), (p) => {
            expect(policy.evaluate({ person: p }).input.person).toEqual(p)
        })

        expect(policy.expr()).toMatchSnapshot()
    })
})
