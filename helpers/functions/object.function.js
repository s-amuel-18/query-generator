export const keys = Object.keys;
export const hasPropertyCall = (obj, attr) =>
  Object.hasOwnProperty.call(obj, attr);
export const isObject = (obj) => typeof obj === "object";
