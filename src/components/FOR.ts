import get from "lodash/get";
import set from "lodash/set";
import { indexArray } from "../utils/object";

// Default error aggregator aggregates all error with the same field into an array,
// And puts the ones without fields into the global property array
function defaultErrorAggregator(accumulator, nextError, values) {
  if (nextError.field) {
    const fieldValue = values ? get(values, nextError.field) : null;
    const existingEntry = get(accumulator.values, nextError.field);

    if (existingEntry) {
      set(accumulator.values, nextError.field, {
        // ...nextError,
        value: fieldValue,
        error: [].concat(existingEntry.error, nextError.message)
      });
    } else {
      set(accumulator.values, nextError.field, {
        // ...nextError,
        value: fieldValue,
        error: nextError.message
      });
    }
  } else {
    accumulator.global.push(nextError.message);
  }

  return accumulator;
}

// Aggregates the error using an aggregator to the schema defined in the schema variable
export function aggregateError(
  error,
  values = {},
  aggregator = defaultErrorAggregator
) {
  const schema = { values: {}, total: error, global: [] };
  const result = error.reduce((accumulator, nextError) => {
    return aggregator(accumulator, nextError, values);
  }, schema);

  return result;
}

// Strips all the fields found in the fields argument from the field property of all the error objects
export function stripFieldsFromError(error, fields) {
  const indexedFields = indexArray(fields);
  return error.map(next => {
    const newNext = { ...next };

    if (newNext.field) {
      const field = newNext.field.split(".");
      newNext.field = field
        .filter(nextField => {
          console.log(indexedFields[nextField], nextField, indexedFields);
          return fields.indexOf(nextField) === -1;
        })
        .join(".");
    }

    return newNext;
  });
}

// Removes all error whose baseName are not found in the baseNames argument
export function filterErrorByBaseName(error, baseNames) {
  return error.filter(next => {
    const newNext = { ...next };

    if (newNext.field) {
      const field = newNext.field.split(".");
      return baseNames.indexOf(field[0]);
    }

    return true;
  });
}

export function replaceErrorBaseName(
  error,
  baseNames: Array<{ from: string; to: string }>
) {
  return error.map(next => {
    const newNext = { ...next };

    if (newNext.field) {
      const field = newNext.field.split(".");
      newNext.field = field
        .map(nextField => {
          const transform = baseNames.find(({ from }) => {
            return from === nextField;
          });

          if (transform) {
            return transform.to;
          } else {
            return nextField;
          }
        })
        .join(".");
    }

    return newNext;
  });
}

// Clears the field property of all error whose baseName is found in the baseNames argument
export function clearFieldFromErrorWithBaseName(error, baseNames) {
  const indexedBaseNames = indexArray(baseNames);
  return error.filter(next => {
    const newNext = { ...next };

    if (newNext.field) {
      const field = newNext.field.split(".");

      if (!!indexedBaseNames[field[0]]) {
        newNext.field = null;
      }
    }

    return true;
  });
}

// Clears the field property of all error whose baseName is found in the baseNames argument
export function clearFieldFromAllError(error) {
  return error.map(next => {
    const newNext = { ...next };
    newNext.field = null;
    return true;
  });
}

// Aggregate all the error to global
export function reduceAllErrorToGlobal(error) {
  error = clearFieldFromAllError(error);
  return aggregateError(error);
}

export function makeSubmitHandler({ before, onError, success, done, submit }) {
  return async function submitHandler(...values) {
    if (before) {
      before();
    }

    try {
      const result = await submit(...values);

      if (success) {
        success(result);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }

    if (done) {
      done();
    }
  };
}
