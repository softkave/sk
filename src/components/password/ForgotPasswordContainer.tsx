import { notification } from "antd";
import React from "react";
import { useDispatch, useStore } from "react-redux";
import { pushOperation } from "../../redux/operations/actions";
import { OperationStatus } from "../../redux/operations/operation";
import { OperationIds.requestForgotPassword } from "../../redux/operations/opc";
import requestForgotPasswordOperationFunc from "../../redux/operations/session/requestForgotPassword";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import ForgotPassword, { IForgotPasswordFormData } from "./ForgotPassword";

const successMessage = `
  Request successful,
  a change password link will been sent to your email address shortly`;

const ForgotPasswordWithTokenContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const [key, setKey] = React.useState(Math.random().toString());
  const store = useStore();
  const operationStatus = useOperation({
    operationId: OperationIds.requestForgotPassword,
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
        pushOperation(OperationIds.requestForgotPassword, {
          status: OperationStatus.consumed,
          timestamp: Date.now(),
        })
      );

      setKey(Math.random().toString());
    }
  }, [operationStatus, dispatch]);

  const onSubmit = async (data: IForgotPasswordFormData) => {
    return requestForgotPasswordOperationFunc(store.getState(), dispatch, data);
  };

  return (
    <ForgotPassword
      key={key}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(ForgotPasswordWithTokenContainer);
