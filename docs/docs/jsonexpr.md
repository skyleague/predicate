# JSONExpressions (jsonexpr)
JSONExpressions (jsonexpr) is a simple logical language that can be used to specify rules for data manipulation and evaluation. It is a standardized way of expressing logical statements in a JSON format, and is intended to be used as a building block for creating more complex systems that need to perform logical operations on data.

JSONExpressions borrows heavily from [JSONLogic](https://jsonlogic.com), which is another data interchange format for expressing logical operations in JSON.

Some of the key concepts that JSONExpressions borrows from JSONLogic include:

* The use of JSON as the base data interchange format
* The ability to specify logical operations using a standardized syntax
* The support for variables and functions in logical expressions
* The use of input data to determine the values of variables in the logical expressions

There are also some notable differences between JSONExpressions and JSONLogic. For example, JSONExpressions introduces additional operators and functions, and has a slightly different syntax for specifying logical expressions.

Overall, JSONExpressions builds upon the foundation established by JSONLogic, providing a more powerful and flexible way to specify logical expressions in JSON.

## Scope

This specification defines JSONExpressions, a data interchange format for expressing logical operations.

## Definitions

* JSON: The JavaScript Object Notation (JSON) data interchange format, as defined in ECMA-404.
* `object`: A JSON object, as defined in ECMA-404.
* `array`: A JSON array, as defined in ECMA-404.
* `boolean`: A JSON boolean, as defined in ECMA-404.
* `null`: A JSON null, as defined in ECMA-404.
* `number`: A JSON number, as defined in ECMA-404.
* `string`: A JSON string, as defined in ECMA-404.

## Operators

JSONRule supports the following operators:

### `var`
An operator to access the values of specific elements in arrays or objects. A data accessor is a string that specifies the path to the element in the data.

There are two types of data accessors:

1. Object accessors: An object accessor is a string that specifies the name of a property in an object. The name is specified as a string.
2. Array accessors: An array accessor is a string that specifies the index of an element in an array. The index is specified as a positive integer. For example, "0" is the first element of the array, "1" is the second element, and so on.

Here is an example of a JSONExpressions document that uses data accessors:
```json
{
    "==": [
        { "var": "x.0" },
        { "var": "y.foo" }
    ]
}
```

In this example, the `==` operator compares the value of the first element of the array `x` to the value of the property foo in the object `y`. The values of `x` and $y would be specified in the input data passed to the JSONExpressions document.

Data accessors can be nested to access elements within arrays or objects. For example, the following data accessor would access the `bar` property of the second element of the `baz` array:

```
"x.baz.1.bar"
```

Note that data accessors are not the same as variables, which are used to reference the values of variables in the input data. Data accessors are used to access specific elements in the input data itself.

### `if`
An operator that takes three arguments: a boolean expression, a value to return if the boolean expression is true, and a value to return if the boolean expression is false.

For example:

```json
{
    "if": [
        true,
        "foo",
        "bar"
    ]
}
```
In this example, the if operator takes three arguments:

* A boolean expression: `true`
* A value to return if the boolean expression is `true`: `"foo"`
* A value to return if the boolean expression is `false`: `"bar"`

Since the boolean expression is true in this example, the result of the if operator would be "foo".

### `and`
An array of boolean expressions, which returns `true` if all of the expressions are `true`, and `false` otherwise.
  
For example:

```json
{ "and": [true, false, true] }
```

This expression would return `false`, because not all of the boolean expressions in the array are `true`.

### `or`
An array of boolean expressions, which returns true if at least one of the expressions is `true`, and `false` otherwise.
For example:

```json
{ "or": [false, false, true] }
```

This expression would return `true`, because at least one of the boolean expressions in the array is `true`.

### `not`
A boolean expression, which returns the negation of the expression.

For example:

```json
{ "not": true }
```

This expression would return `false`, because the negation of `true` is `false`.

### `==` 
An array of two expressions, which returns `true` if the expressions are equal, and `false` otherwise.

For example:

```json
{ "==": [1, 1] }
```

This expression would return `true`, because the two expressions (1 and 1) are equal.

### `!=`
An array of two expressions, which returns `true` if the expressions are not equal, and `false` otherwise.

For example:

```json
{ "!=": [1, 2] }
```

This expression would return `true`, because the two expressions (1 and 2) are not equal.

### `>`
An array of two expressions, which returns `true` if the first expression is greater than the second expression, and `false` otherwise.

For example:

```json
{ ">": [2, 1] }
```

This expression would return `true`, because the first expression (2) is greater than the second expression (1).

### `>=`
An array of two expressions, which returns `true` if the first expression is greater than or equal to the second expression, and `false` otherwise.

For example:

```json
{ ">=": [1, 1] }
```

This expression would return `true`, because the first expression (1) is equal to the second expression (1).

### `<`
An array of two expressions, which returns `true` if the first expression is less than the second expression, and `false` otherwise.

For example:

```json
{ "<": [1, 2] }
```

This expression would return `true`, because the first expression (1) is less than the second expression (2).

### `<=`
An array of two expressions, which returns `true` if the first expression is less than or equal to the second expression, and `false` otherwise.

For example:

```json
{ "<=": [1, 1] }
```

This expression would return `true`, because the first expression (1) is equal to the second expression (1).

### Input data

JSONExpressions supports the use of input data in expressions. The input data is a JSON object that contains the values of the variables used in the JSONExpressions document.

### Evaluation
To evaluate a JSONExpressions document, the following steps should be taken:

1. Replace all occurrences of variables in the JSONLogic document with the corresponding values from the input data.
2. Evaluate all functions and operators in the JSONLogic document, following the rules defined in the specification.
3. Return the resulting value.