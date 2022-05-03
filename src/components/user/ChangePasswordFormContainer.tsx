import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IUpdateUserEndpointErrors } from "../../net/user/user";
import { changePasswordWithCurrentPasswordOpAction } from "../../redux/operations/session/changePasswordWithCurrentPassword";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import ChangePasswordForm, {
  IChangePasswordFormData,
} from "./ChangePasswordForm";

const ChangePasswordFormContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    IFormError<IUpdateUserEndpointErrors> | undefined
  >();
  const onSubmit = async (data: IChangePasswordFormData) => {
    setLoading(true);
    const result = await dispatch(
      changePasswordWithCurrentPasswordOpAction({
        password: data.password,
        currentPassword: data.currentPassword,
        deleteOpOnComplete: true,
      })
    );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const opData = getOpData(op);

    if (opData.isCompleted) {
      message.success("Your password has been updated successfully");
    } else if (opData.isError) {
      const flattenedErrors = flattenErrorList(opData.error);
      setErrors({
        errors: flattenedErrors,
        errorList: opData.error,
      });

      message.error("Error updating your password");
    }

    setLoading(false);
  };

  return (
    <ChangePasswordForm
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
    />
  );
};

export default ChangePasswordFormContainer;
