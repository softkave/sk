import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IAppWorkspace } from "../../models/organization/types";
import CollaborationRequestSelectors from "../../redux/collaborationRequests/selectors";
import { addCollaboratorsOpAction } from "../../redux/operations/collaborationRequest/addCollaborators";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { flattenErrorList } from "../../utils/utils";
import { IFormError } from "../utils/types";
import AddCollaboratorForm, { IAddCollaboratorFormValues } from "./AddCollaboratorForm";

export interface IAddCollaboratorFormContainerProps {
  orgId: string;
  onClose: () => void;
}

const AddCollaboratorFormContainer: React.FC<IAddCollaboratorFormContainerProps> = (props) => {
  const { onClose, orgId } = props;
  const dispatch: AppDispatch = useDispatch();
  const organizationId = orgId;

  const organization = useSelector<IAppState, IAppWorkspace>(
    (state) => OrganizationSelectors.getOne(state, organizationId)!
  );

  const collaboratorIds = organization.collaboratorIds;
  const collaborators = useSelector<IAppState, ICollaborator[]>((state) =>
    UserSelectors.getMany(state, collaboratorIds)
  );

  const requests = useSelector<IAppState, ICollaborationRequest[]>((state) =>
    CollaborationRequestSelectors.filter(
      state,
      (item) => item.from.workspaceId === organization.customId
    )
  );

  const [data, setData] = React.useState<IAddCollaboratorFormValues>({
    collaborators: [],
  });

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IFormError<Record<string, any>> | undefined>();

  const onSubmit = async (values: IAddCollaboratorFormValues) => {
    setLoading(true);
    setData(data);
    const result = await dispatch(
      addCollaboratorsOpAction({
        organizationId: organization.customId,
        ...values,
      })
    );

    const op = unwrapResult(result);
    setLoading(false);

    if (op.error) {
      const flattenedErrors = flattenErrorList(op.error);
      setErrors({
        errors: flattenedErrors,
        errorList: op.error,
      });

      message.error(`Error sending request${values.collaborators.length > 1 ? "s" : ""}`);
    } else {
      onClose();
      message.success(`Request${values.collaborators.length > 1 ? "s" : ""} sent`);
    }
  };

  // TODO: auth check
  const canAddCollaborator = true;

  return (
    <AddCollaboratorForm
      existingCollaborationRequests={requests}
      existingCollaborators={collaborators}
      value={data}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
      disabled={!canAddCollaborator}
    />
  );
};

export default React.memo(AddCollaboratorFormContainer);
