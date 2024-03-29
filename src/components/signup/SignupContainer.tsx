import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { ILoadingState } from "../../redux/key-value/types";
import { signupUserOpAction } from "../../redux/operations/session/signupUser";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import Signup, { ISignupFormData } from "./Signup";

const SignupContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loadingState, setLoadingState] = React.useState<ILoadingState>();
  const errors = loadingState?.error ? flattenErrorList(loadingState.error) : undefined;

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
    const result = await dispatch(
      signupUserOpAction({
        email: user.email,
        name: user.name,
        password: user.password,
      })
    );

    const signupOp = unwrapResult(result);
    setLoadingState(signupOp);

    if (signupOp.error) {
      message.error("Error creating user");
    }
  };

  return <Signup onSubmit={onSubmit} isSubmitting={loadingState?.isLoading} errors={errors} />;
};

export default React.memo(SignupContainer);
