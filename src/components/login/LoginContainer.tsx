import React from "react";
import { useDispatch, useStore } from "react-redux";
import { updateBlockOperationID } from "../../redux/operations/operationIDs";
import loginUserOperationFunc from "../../redux/operations/session/loginUser";
import useOperation from "../hooks/useOperation";
import Login, { ILoginFormValues } from "./Login";

const scopeID = "LoginContainer";

const LoginContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const operationStatus = useOperation({
    scopeID,
    operationID: updateBlockOperationID,
  });

  const onSubmit = async (user: ILoginFormValues) => {
    return loginUserOperationFunc(store.getState(), dispatch, { user });
  };

  console.log({ operationStatus });

  return (
    <Login
      isSubmitting
      onSubmit={onSubmit}
      // isSubmitting={operationStatus.isLoading}
      errors={operationStatus.error}
    />
  );
};

export default React.memo(LoginContainer);
