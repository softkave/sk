import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUpdateUserEndpointErrors } from "../../net/user/user";
import { updateUserOpAction } from "../../redux/operations/session/updateUser";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { IFormError } from "../utils/types";
import UpdateUserFormData, { IUpdateUserDataFormData } from "./UpdateUserDataForm";

const UpdateUserDataFormContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAnonymousUser = useSelector(SessionSelectors.isAnonymousUser);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IFormError<IUpdateUserEndpointErrors> | undefined>();
  const user = useSelector(SessionSelectors.assertGetUser);
  const onSubmit = async (data: IUpdateUserDataFormData) => {
    setLoading(true);
    const result = await dispatch(updateUserOpAction({ data }));
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

      message.error("Error updating your profile");
    } else {
      message.success("Profile updated successfully");
    }

    setLoading(false);
  };

  return (
    <UpdateUserFormData
      user={user}
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
      isDisabled={isAnonymousUser}
    />
  );
};

export default UpdateUserDataFormContainer;
