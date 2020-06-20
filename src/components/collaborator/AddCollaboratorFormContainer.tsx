import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import { pushOperation } from "../../redux/operations/actions";
import addCollaboratorsOperationFunc from "../../redux/operations/block/addCollaborators";
import { OperationStatus } from "../../redux/operations/operation";
import { OperationIds.addCollaborators } from "../../redux/operations/opc";
import { IAppState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import loadBoardData from "../board/data-loaders/loadBoardData";
import useOperation from "../hooks/useOperation";
import AddCollaboratorForm, {
  IAddCollaboratorFormValues,
} from "./AddCollaboratorForm";

const scopeId = "AddCollaboratorFormContainer";

export interface IAddCollaboratorFormContainerProps {
  orgId: string;

  onClose: () => void;
}

const AddCollaboratorFormContainer: React.FC<IAddCollaboratorFormContainerProps> = (
  props
) => {
  const { onClose, orgId } = props;
  const dispatch = useDispatch();

  const organizationId = orgId;

  const organization = useSelector<IAppState, IBlock>(
    (state) => getBlock(state, organizationId)!
  );

  const collaboratorIds = Array.isArray(organization.collaborators)
    ? organization.collaborators
    : [];

  const collaborators = useSelector<IAppState, IUser[]>((state) =>
    getUsersAsArray(state, collaboratorIds)
  );

  const requestIds = Array.isArray(organization.notifications)
    ? organization.notifications
    : [];

  const requests = useSelector<IAppState, INotification[]>((state) =>
    getNotificationsAsArray(state, requestIds)
  );

  const [data, setData] = React.useState<IAddCollaboratorFormValues>({
    collaborators: [],
  });

  const operationStatus = useOperation({
    scopeId,
    operationId: OperationIds.addCollaborators,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  React.useEffect(() => {
    if (operationStatus.isCompleted) {
      onClose();
      dispatch(
        pushOperation(OperationIds.addCollaborators, {
          scopeId,
          status: OperationStatus.consumed,
          timestamp: Date.now(),
        })
      );

      // TODO: we need a loadBlockNotifications func
      loadBoardData(organization);
    }
  });

  const onSubmit = async (values: IAddCollaboratorFormValues) => {
    setData(data);
    addCollaboratorsOperationFunc(
      { block: organization, ...values },
      { scopeId }
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
