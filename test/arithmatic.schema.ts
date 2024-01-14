import { $array, $number, $object, $ref, $validator } from '@skyleague/therefore'

export const arithmetic = $validator(
    $object({
        a: $number,
        b: $number,
    })
)

export const mathFn = $validator(
    $object({
        a: $array($number),
        b: $array($ref(arithmetic)),
    })
)
