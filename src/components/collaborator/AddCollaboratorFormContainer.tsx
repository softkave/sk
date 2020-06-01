import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import { pushOperation } from "../../redux/operations/actions";
import addCollaboratorsOperationFunc from "../../redux/operations/block/addCollaborators";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import { operationStatusTypes } from "../../redux/operations/operation";
import { addCollaboratorsOperationID } from "../../redux/operations/operationIDs";
import { IAppState } from "../../redux/store";
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
  const dispatch = useDispatch();

  const organizationID = orgID;

  const organization = useSelector<IAppState, IBlock>(
    (state) => getBlock(state, organizationID)!
  );

  const collaboratorIDs = Array.isArray(organization.collaborators)
    ? organization.collaborators
    : [];

  const collaborators = useSelector<IAppState, IUser[]>((state) =>
    getUsersAsArray(state, collaboratorIDs)
  );

  const requestIDs = Array.isArray(organization.collaborationRequests)
    ? organization.collaborationRequests
    : [];

  const requests = useSelector<IAppState, INotification[]>((state) =>
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

  React.useEffect(() => {
    if (operationStatus.isCompleted) {
      onClose();
      dispatch(
        pushOperation(addCollaboratorsOperationID, {
          scopeId: scopeID,
          status: operationStatusTypes.consumed,
          timestamp: Date.now(),
        })
      );

      loadBlockCollaborationRequestsOperationFunc({ block: organization });
    }
  });

  const onSubmit = async (values: IAddCollaboratorFormValues) => {
    setData(data);
    addCollaboratorsOperationFunc(
      { block: organization, ...values },
      { scopeId: scopeID }
    );
  };

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
