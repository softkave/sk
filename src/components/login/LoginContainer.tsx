import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { ILoadingState } from "../../redux/key-value/types";
import { loginUserOpAction } from "../../redux/operations/session/loginUser";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import Login, { ILoginFormValues } from "./Login";

const LoginContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loadingState, setLoadingState] = React.useState<ILoadingState>();
  const errors = loadingState?.error ? flattenErrorList(loadingState.error) : undefined;

  const onSubmit = async (user: ILoginFormValues) => {
    const result = await dispatch(
      loginUserOpAction({
        email: user.email,
        password: user.password,
        remember: user.remember,
      })
    );

    const loginOp = unwrapResult(result);
    setLoadingState(loginOp);

    if (loginOp.error) {
      message.error("Error logging you in");
    }
  };

  return <Login onSubmit={onSubmit} isSubmitting={loadingState?.isLoading} errors={errors} />;
};

export default React.memo(LoginContainer);
