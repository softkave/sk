import * as yup from "yup";
import { ValidateOptions } from "yup/lib/types";
import SessionSelectors from "../redux/session/selectors";
import store from "../redux/store";
import { IEndpointResultBase } from "./types";

export function assertEndpointResult(result: IEndpointResultBase) {
  if (result && result.errors) {
    throw result.errors;
  }
}

export function isUserSignedIn() {
  return SessionSelectors.isUserSignedIn(store.getState());
}

export const endpointYupOptions: ValidateOptions = {
  stripUnknown: true,
};

export function getComplexTypeSchema(
  addSchema: yup.AnySchema,
  updateSchema = addSchema
) {
  return yup.object().shape({
    add: yup.array().of(addSchema),
    update: yup.array().of(updateSchema),
    remove: yup.array().of(yup.string()),
  });
}
