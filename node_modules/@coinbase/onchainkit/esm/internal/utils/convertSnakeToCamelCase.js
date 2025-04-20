/**
 * Converts snake_case keys to camelCase in an object or array of objects.
 * @param {T} obj - The object, array, or string to convert. (required)
 * @returns {T} The converted object, array, or string.
 */
function convertSnakeToCamelCase(obj) {
  if (typeof obj === 'string') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => convertSnakeToCamelCase(item));
  }
  if (obj && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelCaseKey = toCamelCase(key);
      acc[camelCaseKey] = convertSnakeToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
export { convertSnakeToCamelCase };
//# sourceMappingURL=convertSnakeToCamelCase.js.map
