import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { signupUserOperationAction } from "../../redux/operations/session/signupUser";
import { AppDispatch } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import Signup, { ISignupFormData } from "./Signup";

const SignupContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
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
    const result = await dispatch(
      signupUserOperationAction({
        email: user.email,
        name: user.name,
        password: user.password,
        opId: op.opId,
      })
    );

    const signupOp = unwrapResult(result);

    if (!signupOp) {
      return;
    }

    const singupOpStat = getOperationStats(signupOp);

    if (singupOpStat.isError) {
      message.error("Error creating user");
    }
  };

  return (
    <Signup onSubmit={onSubmit} isSubmitting={op.isLoading} errors={errors} />
  );
};

export default React.memo(SignupContainer);
