import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUpdateClientEndpointErrors } from "../../net/user/user";
import { updateClientOpAction } from "../../redux/operations/session/updateClient";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { IFormError } from "../utils/types";
import UpdateClientForm, { IUpdateClientFormData } from "./UpdateClientForm";

const UpdateClientFormContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IFormError<IUpdateClientEndpointErrors> | undefined>();
  const client = useSelector(SessionSelectors.assertGetClient);
  const onSubmit = async (data: IUpdateClientFormData) => {
    setLoading(true);
    const result = await dispatch(
      updateClientOpAction({
        data,
      })
    );

    const op = unwrapResult(result);

    if (op.error) {
      const flattenedErrors = flattenErrorList(op.error);
      setErrors({
        errors: flattenedErrors,
        errorList: op.error,
      });

      message.error("Error updating settings");
    } else {
      message.success("Settings updated successfully");
    }

    setLoading(false);
  };

  return (
    <UpdateClientForm
      client={client}
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
    />
  );
};

export default UpdateClientFormContainer;
