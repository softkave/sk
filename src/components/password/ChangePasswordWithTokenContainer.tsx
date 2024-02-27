import { unwrapResult } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import URLSearchParams from "core-js/web/url-search-params";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { ILoadingState } from "../../redux/key-value/types";
import { changePasswordWithForgotTokenOpAction } from "../../redux/operations/session/changePasswordWithForgotToken";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import ChangePassword, { IChangePasswordFormData } from "./ChangePassword";

// TODO: Implement an endpoint to get user email from token ( forgot password and session token )
// TODO: Implement a way to supply token to a net call
// TODO: Implement an endpoint to convert forgot password token to change password token ( maybe not necessary )

const changePasswordSuccessMessage = "Password changed successfully";

const ChangePasswordWithTokenContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const [loadingState, setLoadingState] = React.useState<ILoadingState>();
  const errors = loadingState?.error ? flattenErrorList(loadingState.error) : undefined;

  const onSubmit = async (data: IChangePasswordFormData) => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("t");

    if (!token) {
      message.error("Invalid credentials");
      notification.error({
        message: "Invalid credentials",
        description: "Please try again from the change password email sent to you",
      });

      history.push("/");
      return;
    }

    const result = await dispatch(
      changePasswordWithForgotTokenOpAction({
        token,
        password: data.password,
        remember: data.remember,
      })
    );

    const op = unwrapResult(result);
    setLoadingState(op);

    if (op.error) {
      message.error("Error changing password");
    } else {
      message.success(changePasswordSuccessMessage);
    }
  };

  return (
    <ChangePassword onSubmit={onSubmit} isSubmitting={loadingState?.isLoading} errors={errors} />
  );
};

export default React.memo(ChangePasswordWithTokenContainer);
