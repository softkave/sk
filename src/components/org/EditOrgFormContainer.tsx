import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { IAppOrganization } from "../../models/organization/types";
import { newFormOrganization } from "../../models/organization/utils";
import { IAddBlockEndpointErrors } from "../../net/block/types";
import OperationActions from "../../redux/operations/actions";
import { createOrganizationOpAction } from "../../redux/operations/organization/createOrganization";
import { updateOrganizationOpAction } from "../../redux/operations/organization/updateOrganization";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import EditOrgForm, { IEditOrgFormValues } from "./EditOrgForm";

export interface IEditOrgFormContainerProps {
  onClose: () => void;
  organization?: IAppOrganization;
}

const EditOrgFormContainer: React.FC<IEditOrgFormContainerProps> = (props) => {
  const { onClose } = props;
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = React.useState<IEditOrgFormValues>(
    () => props.organization || newFormOrganization()
  );

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    IFormError<IAddBlockEndpointErrors["block"]> | undefined
  >();

  const onSubmit = async (values: IEditOrgFormValues) => {
    const data = { ...formData, ...values };
    setLoading(true);
    setFormData(data);
    const result = props.organization
      ? await dispatch(
          updateOrganizationOpAction({
            organizationId: props.organization.customId,
            organization: data,
          })
        )
      : await dispatch(createOrganizationOpAction(data));

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
    <EditOrgForm
      org={props.organization}
      value={formData as any}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
    />
  );
};

export default React.memo(EditOrgFormContainer);
