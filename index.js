'use strict';

function superStringify(obj, space, alreadyDumpedIn, levelIn, thisKeyIn) {
  let alreadyDumped = alreadyDumpedIn || [];
  let level = levelIn || 1;
  let thisKey = thisKeyIn || 'this';

  let newlineDelimiter = space ? '\n' : '';
  let objValueDelimiter = space ? ' ' : '';
  let charDelimiter = space ? (typeof(space) == 'number' ? ' '.repeat(space) : space) : '';

  if (obj === null) {
    return 'null';
  } else if (obj === undefined) {
    return '[Undefined]';
  } else if (Array.isArray(obj)) {
    let res = '';
    let len = obj.length;
    for (let index = 0; index < len; index++) {
      let el;
      if (obj[index] !== undefined) {
        el = superStringify(obj[index], space, alreadyDumped, level + 1, thisKey + '[' + index + ']');
      } else if (index in obj) {
        el = '[Undefined]';
      } else {
        el = '[Empty]';
      }
      res += (index == 0 ? '[' : '') + newlineDelimiter + charDelimiter.repeat(level) + el + (index < len - 1 ? ',' : newlineDelimiter + charDelimiter.repeat(level - 1) + ']');
    }
    return res || '[]';
  } else if (typeof(obj) == 'object') {
    let dupOf = alreadyDumped.find(rec => rec.obj == obj);
    if (dupOf) {
      return '[ReferenceTo ' + dupOf.key + ']';
    }
    alreadyDumped.push({ obj: obj, key: thisKey });
    let res = '';
    let len = Object.keys(obj).length;
    Object.keys(obj).forEach((key, index) => {
      res += (index == 0 ? '{' : '') + newlineDelimiter + charDelimiter.repeat(level) + JSON.stringify(key) + ':' + objValueDelimiter + superStringify(obj[key], space, alreadyDumped, level + 1, thisKey + '.' + key) + (index < len - 1 ? ',' : newlineDelimiter + charDelimiter.repeat(level - 1) + '}');
    });
    return res || '{}';
  } else if (typeof(obj) == 'function') {
    let dupOf = alreadyDumped.find(rec => rec.obj == obj);
    if (dupOf) {
      return '[ReferenceTo ' + dupOf.key + ']';
    }
    alreadyDumped.push({ obj: obj, key: thisKey });
    return '[Function]';
  } else if (typeof(obj) == 'symbol') {
    return '[Symbol]';
  } else if (typeof(obj) == 'number') {
    return isNaN(obj) ? '[NaN]' : JSON.stringify(obj);
  } else if (['boolean', 'string'].includes(typeof(obj))) {
    return JSON.stringify(obj);
  } else {
    return '[Unknown]';
  }
}

module.exports = superStringify;
