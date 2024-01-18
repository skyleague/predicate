import { $array, $boolean, $integer, $object, $string, $union, $validator } from '@skyleague/therefore'

export const logicObj = $validator(
    $object({
        c: $boolean,
        a: $union([$string, $boolean, $integer]),
        b: $union([$string, $boolean, $integer]),
        d: $array($object({ a: $boolean, b: $boolean })),
        e: $boolean,
    })
)
