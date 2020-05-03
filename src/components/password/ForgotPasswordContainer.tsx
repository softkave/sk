import { notification } from "antd";
import React from "react";
import { useDispatch, useStore } from "react-redux";
import { pushOperation } from "../../redux/operations/actions";
import { operationStatusTypes } from "../../redux/operations/operation";
import { requestForgotPasswordOperationID } from "../../redux/operations/operationIDs";
import requestForgotPasswordOperationFunc from "../../redux/operations/session/requestForgotPassword";
import useOperation from "../hooks/useOperation";
import ForgotPassword, { IForgotPasswordFormData } from "./ForgotPassword";

const scopeID = "ForgotPasswordWithTokenContainer";
const successMessage = `
  Request was successful,
  a change password link will been sent to your email address shortly.`;

const ForgotPasswordWithTokenContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const operationStatus = useOperation({
    scopeID,
    operationID: requestForgotPasswordOperationID,
  });

  React.useEffect(() => {
    if (operationStatus.isCompleted) {
      notification.success({
        message: "Forgot Password",
        description: successMessage,
        duration: 0,
      });

      dispatch(
        pushOperation(requestForgotPasswordOperationID, {
          scopeID,
          status: operationStatusTypes.consumed,
          timestamp: Date.now(),
        })
      );
    }
  });

  const onSubmit = async (data: IForgotPasswordFormData) => {
    return requestForgotPasswordOperationFunc(store.getState(), dispatch, data);
  };

  console.log({ operationStatus });

  return (
    <ForgotPassword
      isSubmitting
      onSubmit={onSubmit}
      // isSubmitting={operationStatus.isLoading}
      errors={operationStatus.error}
    />
  );
};

export default React.memo(ForgotPasswordWithTokenContainer);
