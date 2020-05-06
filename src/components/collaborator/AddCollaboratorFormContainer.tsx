import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import addCollaboratorsOperationFunc from "../../redux/operations/block/addCollaborators";
import { addCollaboratorsOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import AddCollaboratorForm, {
  IAddCollaboratorFormValues,
} from "./AddCollaboratorForm";

const scopeID = "AddCollaboratorFormContainer";

export interface IAddCollaboratorFormContainerProps {
  orgID: string;

  onClose: () => void;
}

const AddCollaboratorFormContainer: React.FC<IAddCollaboratorFormContainerProps> = (
  props
) => {
  const { onClose, orgID } = props;

  const organizationID = orgID;

  const organization = useSelector<IReduxState, IBlock>(
    (state) => getBlock(state, organizationID)!
  );

  const collaboratorIDs = Array.isArray(organization.collaborators)
    ? organization.collaborators
    : [];

  const collaborators = useSelector<IReduxState, IUser[]>((state) =>
    getUsersAsArray(state, collaboratorIDs)
  );

  const requestIDs = Array.isArray(organization.collaborationRequests)
    ? organization.collaborationRequests
    : [];

  const requests = useSelector<IReduxState, INotification[]>((state) =>
    getNotificationsAsArray(state, requestIDs)
  );

  const [data, setData] = React.useState<IAddCollaboratorFormValues>({
    collaborators: [],
  });

  const operationStatus = useOperation({
    scopeID,
    operationID: addCollaboratorsOperationID,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  const onSubmit = async (values: IAddCollaboratorFormValues) => {
    setData(data);
    addCollaboratorsOperationFunc(
      { block: organization, ...values },
      { scopeID }
    );
  };

  console.log({ operationStatus });

  return (
    <AddCollaboratorForm
      existingCollaborationRequests={requests}
      existingCollaborators={collaborators}
      value={data}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(AddCollaboratorFormContainer);
