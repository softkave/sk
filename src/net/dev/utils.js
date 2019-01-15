module.exports = exports;

exports.generateError = function generateError(data) {
  return {
    errors: Object.keys(data).map(key => ({
      field: key,
      errors: ["invalid data"]
    }))
  };
};

exports.makeShouldRespondWithError = function makeRespondWithError() {
  let testIteration = {};
  return function shouldRespondWithError(path) {
    testIteration[path]++;
    if (testIteration[path] % 2) {
      return true;
    }

    return false;
  };
};

let devShareObj = {};

export function devShare(space, data) {
  if (data) {
    devShareObj[space] = data;
  }

  return devShareObj[space];
  // let namespace = devShareObj[space];
  // if (!namespace) {
  //   namespace = devShareObj[space] = data || {};
  // }
  // else if (data) {
  //   namespace = data;
  // }

  // return namespace;
}
