import { notification } from "antd";
import React from "react";
import { useDispatch, useStore } from "react-redux";
import { pushOperation } from "../../redux/operations/actions";
import { operationStatusTypes } from "../../redux/operations/operation";
import { changePasswordOperationID } from "../../redux/operations/operationIDs";
import changePasswordOperationFunc from "../../redux/operations/session/changePassword";
import useOperation from "../hooks/useOperation";
import ChangePassword, { IChangePasswordFormData } from "./ChangePassword";

// TODO: Implement an endpoint to get user email from token ( forgot password and session token )
// TODO: Implement a way to supply token to a net call
// TODO: Implement an endpoint to convert forgot password token to change password token ( maybe not necessary )

const scopeID = "ChangePasswordWithTokenContainer";
const changePasswordSuccessMessage = "Password changed successfully";

const ChangePasswordWithTokenContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const operationStatus = useOperation({
    scopeID,
    operationID: changePasswordOperationID,
  });

  React.useEffect(() => {
    if (operationStatus.isCompleted) {
      notification.success({
        message: "Change Password",
        description: changePasswordSuccessMessage,
        duration: 0,
      });

      dispatch(
        pushOperation(changePasswordOperationID, {
          scopeID,
          status: operationStatusTypes.consumed,
          timestamp: Date.now(),
        })
      );
    }
  });

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

  console.log({ operationStatus });

  return (
    <ChangePassword
      isSubmitting
      onSubmit={onSubmit}
      // isSubmitting={operationStatus.isLoading}
      errors={operationStatus.error}
    />
  );
};

export default React.memo(ChangePasswordWithTokenContainer);
