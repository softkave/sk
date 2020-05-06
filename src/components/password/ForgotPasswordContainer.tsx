import { notification } from "antd";
import React from "react";
import { useDispatch, useStore } from "react-redux";
import { pushOperation } from "../../redux/operations/actions";
import { operationStatusTypes } from "../../redux/operations/operation";
import { requestForgotPasswordOperationID } from "../../redux/operations/operationIDs";
import requestForgotPasswordOperationFunc from "../../redux/operations/session/requestForgotPassword";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import ForgotPassword, { IForgotPasswordFormData } from "./ForgotPassword";

const successMessage = `
  Request successful,
  a change password link will been sent to your email address shortly`;

const ForgotPasswordWithTokenContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const operationStatus = useOperation({
    operationID: requestForgotPasswordOperationID,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  React.useEffect(() => {
    if (operationStatus.isCompleted) {
      notification.success({
        message: "Forgot Password",
        description: successMessage,
        duration: 0,
      });

      dispatch(
        pushOperation(requestForgotPasswordOperationID, {
          status: operationStatusTypes.consumed,
          timestamp: Date.now(),
        })
      );
    }
  }, [operationStatus, dispatch]);

  const onSubmit = async (data: IForgotPasswordFormData) => {
    return requestForgotPasswordOperationFunc(store.getState(), dispatch, data);
  };

  return (
    <ForgotPassword
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(ForgotPasswordWithTokenContainer);
