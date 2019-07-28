import { INetError } from "../net/query";
import { indexArray } from "../utils/object";

export function withGlobalError(values: object) {
  return {
    ...values,
    error: undefined
  };
}

export function getGlobalError(errors: object) {
  return (errors as any).error;
}

const defaultFields = ["error"];
export function deleteFields(values: object, fields: string[] = defaultFields) {
  const updated = { ...values };
  fields.forEach(field => delete updated[field]);
  return updated;
}

export function flattenErrorToObject(error: INetError[]) {
  return indexArray(error, {
    indexer: (next: INetError) => {
      if (next.field) {
        return next.field;
      } else {
        return "error";
      }
    },
    proccessValue: (value, existing) => {
      if (existing) {
        existing.push(value.message);
        return existing;
      } else {
        return [value];
      }
    }
  });
}

export async function submitHandler(onSubmit, values: object, { setErrors }) {
  try {
    const result = await onSubmit(deleteFields(values));
    return result;
  } catch (error) {
    setErrors(flattenErrorToObject(error));
  }
}
