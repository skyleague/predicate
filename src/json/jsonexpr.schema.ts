import type { Node } from '@skyleague/therefore'
import { $array, $boolean, $number, $object, $record, $ref, $string, $tuple, $union, $unknown } from '@skyleague/therefore'

export const fromExpr = $object({ from: $tuple([$string, $string]) })
export const valueItemExpr = $object({ value: $string })

export const numberExpr: Node = $union([$ref(fromExpr), $number, $ref(() => numberFnExpr), $ref(valueItemExpr)])
export const numberArrExpr = $union([$ref(fromExpr), $array($number), $ref(valueItemExpr)])
export const stringExpr: Node = $union([$ref(fromExpr), $string, $ref(() => stringFnExpr), $ref(valueItemExpr)])
export const stringArrExpr = $union([$ref(fromExpr), $array($string), $ref(valueItemExpr)])
export const booleanExpr: Node = $union([$ref(fromExpr), $boolean, $ref(() => booleanFnExpr), $ref(valueItemExpr)])
export const booleanArrExpr = $union([$ref(fromExpr), $array($boolean), $ref(valueItemExpr)])

export const addExpr = $object({
    '+': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const subExpr = $object({
    '-': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const mulExpr = $object({
    '*': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const divExpr = $object({
    '/': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const modExpr = $object({
    '%': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const minExpr = $object({
    min: $tuple([$ref(numberArrExpr)]),
})

export const maxExpr = $object({
    max: $tuple([$ref(numberArrExpr)]),
})

export const numberFnExpr = $union([
    $ref(addExpr),
    $ref(subExpr),
    $ref(mulExpr),
    $ref(divExpr),
    $ref(modExpr),
    $ref(minExpr),
    $ref(maxExpr),
])

export const startsWithExpr = $object({
    startsWith: $tuple([$ref(stringExpr), $ref(stringExpr)]),
})

export const endsWithExpr = $object({
    endsWith: $tuple([$ref(stringExpr), $ref(stringExpr)]),
})

export const includesExpr = $object({
    includes: $tuple([$ref(stringExpr), $ref(stringExpr)]),
})

export const ifExpr = $object({
    if: $tuple([$ref(() => booleanExpr), $ref(() => JSONExpr), $ref(() => JSONExpr)]),
})

export const andExpr = $object({
    and: $array($ref(() => booleanExpr)),
})

export const orExpr = $object({
    or: $array($ref(() => booleanExpr)),
})

export const equalExpr = $object({
    '==': $tuple([$ref(() => JSONExpr), $ref(() => JSONExpr)]),
})

export const notExpr = $object({
    '~': $ref(() => booleanExpr),
})

export const gtExpr = $object({
    '>': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const gteExpr = $object({
    '>=': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const ltExpr = $object({
    '<': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const lteExpr = $object({
    '<=': $tuple([$ref(numberExpr), $ref(numberExpr)]),
})

export const allExpr = $object({
    all: $tuple([$ref(() => valueExpr), $ref(booleanExpr)]),
})

export const anyExpr = $object({
    any: $tuple([$ref(() => valueExpr), $ref(booleanExpr)]),
})

export const booleanFnExpr = $union([
    $ref(ifExpr),
    $ref(andExpr),
    $ref(orExpr),
    $ref(equalExpr),
    $ref(notExpr),
    $ref(gtExpr),
    $ref(gteExpr),
    $ref(ltExpr),
    $ref(lteExpr),
    $ref(startsWithExpr),
    $ref(endsWithExpr),
    $ref(includesExpr),
    $ref(allExpr),
    $ref(anyExpr),
])

export const concatExpr = $object({
    concat: $tuple([$ref(stringExpr), $ref(stringExpr)]),
})

export const stringFnExpr = $union([$ref(concatExpr)])

export const valueExpr = $union([
    $ref(() => hofExpr),
    $ref(numberExpr),
    $ref(numberArrExpr),
    $ref(stringExpr),
    $ref(stringArrExpr),
    $ref(booleanExpr),
    $ref(booleanArrExpr),
])

export const mapExpr = $object({
    map: $tuple([$ref(valueExpr), $ref(valueExpr)]),
})

export const filterExpr = $object({
    filter: $tuple([$ref(valueExpr), $ref(booleanExpr)]),
})

export const hofExpr: Node = $union([$ref(mapExpr), $ref(filterExpr)])

export const JSONExpr: Node = $union([
    $ref(valueExpr),
    $record(
        $union([
            $ref(() => JSONExpr),
            $array(
                $ref(() => JSONExpr),
                { minItems: 1 },
            ),
        ]),
    ),
]).validator()

export const JSONExprDefinition = $object({
    meta: $object({
        version: $string,
    }),
    input: $record($unknown).optional(),
    output: $record($ref(JSONExpr)),
}).validator()
