export const keys = Object.keys;
export const hasPropertyCall = (obj, attr) =>
  Object.hasOwnProperty.call(obj, attr);
export const isObject = (obj) =>
  Object.prototype.toString.call(obj) === "[object Object]";
