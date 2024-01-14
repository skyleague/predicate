import { $object, $string, $validator } from '@skyleague/therefore'

export const abObj = $validator(
    $object({
        a: $string,
        b: $string,
    })
)
