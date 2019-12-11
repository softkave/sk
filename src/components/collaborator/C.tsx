import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlockCollaboratorsOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import EmptyContainer from "../Empty";
import GeneralError from "../GeneralError";
import useOperation from "../hooks/useOperation";
import List from "../styled/List";
import CollaboratorThumbnail from "./CollaboratorThumbnail";


export interface ICProps {
  organization: IBlock;
}

const C: React.FC<ICProps> = props => {
  const { organization } = props;
  const collaborators = useSelector<IReduxState, IUser[]>(state =>
    getUsersAsArray(state, organization.collaborators)
  );
  const collaboratorsStatus = useOperation({
    operationID: getBlockCollaboratorsOperationID,
    resourceID: organization.customId
  });

  if (collaboratorsStatus.error) {
    return <GeneralError error={collaboratorsStatus.error} />;
  } else if (collaborators.length === 0) {
    return <EmptyContainer>No collaborators yet.</EmptyContainer>;
  }

  const renderItem = (collaborator: IUser) => {
    return <CollaboratorThumbnail collaborator={collaborator} />;
  };

  const getCollaboratorID = (collaborator: IUser) => {
    return collaborator.customId;
  };

  return (
    <List
        dataSource={collaborators}
        rowKey={getCollaboratorID}
        renderItem={renderItem}
      />
  );
};

export default C;
