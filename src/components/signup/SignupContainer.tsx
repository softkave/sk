import React from "react";
import { useDispatch, useStore } from "react-redux";
import signupUserOperationFunc from "../../redux/operations/session/sigupUser";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import Signup, { ISignupFormData } from "./Signup";

const SignupContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const op = useOperation();

  const errors = op.error
    ? flattenErrorListWithDepthInfinite(op.error)
    : undefined;

  if (errors) {
    if (errors.errors) {
      const i = errors.errors.findIndex((err) => {
        // TODO: this is a hack, find a better way
        return err === "This email address is not available";
      });

      if (i !== -1) {
        const emailExistsError = errors.errors[i];
        errors.errors.splice(i, 1);

        if (errors.name) {
          errors.name.push(emailExistsError);
        } else {
          errors.name = [emailExistsError];
        }
      }
    }
  }

  const onSubmit = async (user: ISignupFormData) => {
    return signupUserOperationFunc(
      store.getState(),
      dispatch,
      { user },
      { id: op.id }
    );
  };

  return (
    <Signup onSubmit={onSubmit} isSubmitting={op.isLoading} errors={errors} />
  );
};

export default React.memo(SignupContainer);
