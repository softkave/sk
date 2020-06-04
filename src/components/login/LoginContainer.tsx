import React from "react";
import { useDispatch, useStore } from "react-redux";
import { loginUserOperationId } from "../../redux/operations/operationIDs";
import loginUserOperationFunc from "../../redux/operations/session/loginUser";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import Login, { ILoginFormValues } from "./Login";

const LoginContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const operationStatus = useOperation({
    operationId: loginUserOperationId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  const onSubmit = async (user: ILoginFormValues) => {
    return loginUserOperationFunc(store.getState(), dispatch, { user });
  };

  return (
    <Login
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(LoginContainer);
