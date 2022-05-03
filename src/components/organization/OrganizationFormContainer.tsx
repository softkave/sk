import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { IAppOrganization } from "../../models/organization/types";
import {
  formOrganizationFromExisting,
  newFormOrganization,
} from "../../models/organization/utils";
import OperationActions from "../../redux/operations/actions";
import { createOrganizationOpAction } from "../../redux/operations/organization/createOrganization";
import { updateOrganizationOpAction } from "../../redux/operations/organization/updateOrganization";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import OrganizationForm, { IOrganizationFormValues } from "./OrganizationForm";

export interface IOrganizationFormContainerProps {
  onClose: () => void;
  organization?: IAppOrganization;
}

const OrganizationFormContainer: React.FC<IOrganizationFormContainerProps> = (
  props
) => {
  const { onClose } = props;
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = React.useState<IOrganizationFormValues>(() =>
    props.organization
      ? formOrganizationFromExisting(props.organization)
      : newFormOrganization()
  );

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    IFormError<Record<string, any>> | undefined
  >();

  const onSubmit = async (values: IOrganizationFormValues) => {
    const data = { ...formData, ...values };
    setLoading(true);
    setFormData(data);
    const result = props.organization
      ? await dispatch(
          updateOrganizationOpAction({
            organizationId: props.organization.customId,
            data: data,
          })
        )
      : await dispatch(createOrganizationOpAction({ organization: data }));

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const opData = getOpData(op);
    const organization = op.status.data;
    setLoading(false);

    if (opData.error) {
      if (props.organization) {
        message.error("Error updating organization");
      } else {
        message.error("Error creating organization");
      }

      const flattenedErrors = flattenErrorList(opData.error);
      setErrors({
        errors: flattenedErrors,
        errorList: opData.error,
      });
    } else {
      if (props.organization) {
        message.success("Organization updated");
      } else {
        message.success("Organization created");
        history.push(`/app/orgs/${organization!.customId}`);
        onClose();
      }

      dispatch(OperationActions.deleteOperation(opData.opId));
    }
  };

  return (
    <OrganizationForm
      org={props.organization}
      value={formData as any}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
    />
  );
};

export default React.memo(OrganizationFormContainer);
