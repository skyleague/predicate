/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code 
 * eslint-disable
 */
"use strict";export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"Arithmetic","type":"object","properties":{"a":{"type":"number"},"b":{"type":"number"}},"required":["a","b"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((data.a === undefined) && (missing0 = "a")) || ((data.b === undefined) && (missing0 = "b"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.a !== undefined){let data0 = data.a;const _errs2 = errors;if(!((typeof data0 == "number") && (isFinite(data0)))){validate10.errors = [{instancePath:instancePath+"/a",schemaPath:"#/properties/a/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.b !== undefined){let data1 = data.b;const _errs4 = errors;if(!((typeof data1 == "number") && (isFinite(data1)))){validate10.errors = [{instancePath:instancePath+"/b",schemaPath:"#/properties/b/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;