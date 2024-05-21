import { $number, $object, $string, $validator } from '@skyleague/therefore'

export const person = $validator(
    $object({
        firstName: $string,
        lastName: $string,
        birthDate: $string,
        age: $number,
    }),
)
