/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code 
 * eslint-disable
 */
"use strict";export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"MathFn","type":"object","properties":{"a":{"type":"array","items":{"type":"number"}},"b":{"type":"array","items":{"$ref":"#/$defs/Arithmetic"}}},"required":["a","b"],"additionalProperties":true,"$defs":{"Arithmetic":{"type":"object","properties":{"a":{"type":"number"},"b":{"type":"number"}},"required":["a","b"],"additionalProperties":true,"title":"Arithmetic"}}};const schema12 = {"type":"object","properties":{"a":{"type":"number"},"b":{"type":"number"}},"required":["a","b"],"additionalProperties":true,"title":"Arithmetic"};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((data.a === undefined) && (missing0 = "a")) || ((data.b === undefined) && (missing0 = "b"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.a !== undefined){let data0 = data.a;const _errs2 = errors;if(errors === _errs2){if(Array.isArray(data0)){var valid1 = true;const len0 = data0.length;for(let i0=0; i0<len0; i0++){let data1 = data0[i0];const _errs4 = errors;if(!((typeof data1 == "number") && (isFinite(data1)))){validate10.errors = [{instancePath:instancePath+"/a/" + i0,schemaPath:"#/properties/a/items/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid1 = _errs4 === errors;if(!valid1){break;}}}else {validate10.errors = [{instancePath:instancePath+"/a",schemaPath:"#/properties/a/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.b !== undefined){let data2 = data.b;const _errs6 = errors;if(errors === _errs6){if(Array.isArray(data2)){var valid2 = true;const len1 = data2.length;for(let i1=0; i1<len1; i1++){let data3 = data2[i1];const _errs8 = errors;const _errs9 = errors;if(errors === _errs9){if(data3 && typeof data3 == "object" && !Array.isArray(data3)){let missing1;if(((data3.a === undefined) && (missing1 = "a")) || ((data3.b === undefined) && (missing1 = "b"))){validate10.errors = [{instancePath:instancePath+"/b/" + i1,schemaPath:"#/$defs/Arithmetic/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data3.a !== undefined){let data4 = data3.a;const _errs12 = errors;if(!((typeof data4 == "number") && (isFinite(data4)))){validate10.errors = [{instancePath:instancePath+"/b/" + i1+"/a",schemaPath:"#/$defs/Arithmetic/properties/a/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid4 = _errs12 === errors;}else {var valid4 = true;}if(valid4){if(data3.b !== undefined){let data5 = data3.b;const _errs14 = errors;if(!((typeof data5 == "number") && (isFinite(data5)))){validate10.errors = [{instancePath:instancePath+"/b/" + i1+"/b",schemaPath:"#/$defs/Arithmetic/properties/b/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid4 = _errs14 === errors;}else {var valid4 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/b/" + i1,schemaPath:"#/$defs/Arithmetic/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid2 = _errs8 === errors;if(!valid2){break;}}}else {validate10.errors = [{instancePath:instancePath+"/b",schemaPath:"#/properties/b/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs6 === errors;}else {var valid0 = true;}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;