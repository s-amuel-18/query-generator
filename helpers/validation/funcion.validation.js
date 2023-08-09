import validator from "validator";
const { isInt, isNumeric: isNum, isFloat, isISO8601: isDate } = validator;

export { isInt, isNum, isDate };

export const isString = (value) => typeof value === "string";

export const isArray = Array.isArray;

export const arrayIsNotEmpty = (value) => value.length > 0;

export const eachItemIsString = (value) =>
  isArray(value) && arrayIsNotEmpty(value) && value.every(isString);

export const eachItemIsNumber = (value) =>
  isArray(value) && arrayIsNotEmpty(value) && value.every(isNum);

export const eachItemIsInt = (value) =>
  isArray(value) && arrayIsNotEmpty(value) && value.every(isInt);

export const eachItemIsFloat = (value) =>
  isArray(value) && arrayIsNotEmpty(value) && value.every(isFloat);

export const eachItemIsDate = (value) =>
  isArray(value) && arrayIsNotEmpty(value) && value.every(isDate);

export const isArrayOrString = (value) =>
  isString(value) || eachItemIsString(value);

export const isArrayOrDate = (value) =>
  (isString(value) && isDate(value)) || eachItemIsDate(value);

export const isArrayOrNumber = (value) =>
  (isString(value) && isNum(value)) || eachItemIsNumber(value);

export const isArrayOrInt = (value) =>
  (isString(value) && isInt(value)) || eachItemIsInt(value);
