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
      set(accumulator.values, {
        ...nextError,
        value: fieldValue,
        error: [].concat(existingEntry.error, nextError.message)
      });
    } else {
      set(accumulator.values, {
        ...nextError,
        value: fieldValue,
        error: nextError.message
      });
    }
  } else {
    accumulator.global.push(nextError);
  }

  return accumulator;
}

// Aggregates the error using an aggregator to the schema defined in the schema variable
export function aggregateError(
  error,
  values,
  aggregator = defaultErrorAggregator
) {
  let schema = { values: {}, total: error, global: [] };
  let result = error.reduce((accumulator, nextError) => {
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
          return !!!indexedFields[nextField];
        })
        .join(".");
    }

    return newNext;
  });
}

// Removes all error whose baseName are not found in the baseNames argument
export function filterErrorByBaseName(error, baseNames) {
  const indexedBaseNames = indexArray(baseNames);
  return error.filter(next => {
    const newNext = { ...next };

    if (newNext.field) {
      const field = newNext.field.split(".");
      return !!indexedBaseNames[field[0]];
    }

    return true;
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
