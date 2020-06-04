import { message } from "antd";
import React from "react";
import { useDispatch, useStore } from "react-redux";
import { pushOperation } from "../../redux/operations/actions";
import { operationStatusTypes } from "../../redux/operations/operation";
import { changePasswordOperationId } from "../../redux/operations/operationIDs";
import changePasswordOperationFunc from "../../redux/operations/session/changePassword";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import ChangePassword, { IChangePasswordFormData } from "./ChangePassword";

// TODO: Implement an endpoint to get user email from token ( forgot password and session token )
// TODO: Implement a way to supply token to a net call
// TODO: Implement an endpoint to convert forgot password token to change password token ( maybe not necessary )

const changePasswordSuccessMessage = "Password changed successfully";

const ChangePasswordWithTokenContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const operationStatus = useOperation({
    operationId: changePasswordOperationId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  React.useEffect(() => {
    if (operationStatus.isCompleted) {
      message.success(changePasswordSuccessMessage);

      dispatch(
        pushOperation(changePasswordOperationId, {
          status: operationStatusTypes.consumed,
          timestamp: Date.now(),
        })
      );
    }
  }, [operationStatus, dispatch]);

  const onSubmit = async (data: IChangePasswordFormData) => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("t");

    return changePasswordOperationFunc(store.getState(), dispatch, {
      password: data.password,

      // TODO: Fetch email using the token
      // email: "",
      token: token!,
    });
  };

  return (
    <ChangePassword
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(ChangePasswordWithTokenContainer);
