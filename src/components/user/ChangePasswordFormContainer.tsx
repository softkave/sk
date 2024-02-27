import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUpdateUserEndpointErrors } from "../../net/user/user";
import { changePasswordWithCurrentPasswordOpAction } from "../../redux/operations/session/changePasswordWithCurrentPassword";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { IFormError } from "../utils/types";
import ChangePasswordForm, { IChangePasswordFormData } from "./ChangePasswordForm";

const ChangePasswordFormContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAnonymousUser = useSelector(SessionSelectors.isAnonymousUser);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IFormError<IUpdateUserEndpointErrors> | undefined>();
  const onSubmit = async (data: IChangePasswordFormData) => {
    setLoading(true);
    const result = await dispatch(
      changePasswordWithCurrentPasswordOpAction({
        password: data.password,
        currentPassword: data.currentPassword,
      })
    );

    const op = unwrapResult(result);
    if (!op) {
      setLoading(false);
      return;
    }

    if (op.error) {
      const flattenedErrors = flattenErrorList(op.error);
      setErrors({
        errors: flattenedErrors,
        errorList: op.error,
      });
      message.error("Error updating your password");
    } else {
      message.success("Your password has been updated successfully");
    }

    setLoading(false);
  };

  return (
    <ChangePasswordForm
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
      isDisabled={isAnonymousUser}
    />
  );
};

export default ChangePasswordFormContainer;
