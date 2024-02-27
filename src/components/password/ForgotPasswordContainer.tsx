import { unwrapResult } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { ILoadingState } from "../../redux/key-value/types";
import { requestForgotPasswordOpAction } from "../../redux/operations/session/requestForgotPassword";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import ForgotPassword, { IForgotPasswordFormData } from "./ForgotPassword";

const successMessage = `
  A change password link will be sent to your email address shortly`;

const ForgotPasswordWithTokenContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [key, setKey] = React.useState(Math.random().toString());
  const [loadingState, setLoadingState] = React.useState<ILoadingState>();
  const errors = loadingState?.error ? flattenErrorList(loadingState.error) : undefined;

  const onSubmit = async (data: IForgotPasswordFormData) => {
    const result = await dispatch(
      requestForgotPasswordOpAction({
        email: data.email,
      })
    );

    const op = unwrapResult(result);
    setLoadingState(op);

    if (op.error) {
      message.error("Error requesting change of password");
    } else {
      notification.success({
        message: "Request successful",
        description: successMessage,
        duration: 0,
      });

      setKey(Math.random().toString());
    }
  };

  return (
    <ForgotPassword
      key={key}
      onSubmit={onSubmit}
      isSubmitting={loadingState?.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(ForgotPasswordWithTokenContainer);
