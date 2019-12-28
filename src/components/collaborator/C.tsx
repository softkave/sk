import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlockCollaboratorsOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import EmptyMessage from "../EmptyMessage";
import GeneralError from "../GeneralError";
import useOperation from "../hooks/useOperation";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import CollaboratorThumbnail from "./CollaboratorThumbnail";

export interface ICProps {
  organization: IBlock;
}

const C: React.FC<ICProps> = props => {
  const { organization } = props;
  const collaborators = useSelector<IReduxState, IUser[]>(state =>
    getUsersAsArray(state, organization.collaborators!)
  );
  const collaboratorsStatus = useOperation({
    operationID: getBlockCollaboratorsOperationID,
    resourceID: organization.customId
  });

  if (collaboratorsStatus.error) {
    return (
      <StyledContainer
        s={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <GeneralError error={collaboratorsStatus.error} />
      </StyledContainer>
    );
  } else if (collaborators.length === 0) {
    return <EmptyMessage>No collaborators yet.</EmptyMessage>;
  }

  const renderItem = (collaborator: IUser) => {
    return <StyledContainer s={{ padding: "16px 0" }}><CollaboratorThumbnail collaborator={collaborator} /></StyledContainer>;
  };

  const getCollaboratorID = (collaborator: IUser) => {
    return collaborator.customId;
  };

  return (
    <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
      <h3>Collaborators</h3>
      <List
        dataSource={collaborators}
        rowKey={getCollaboratorID}
        renderItem={renderItem}
      />
    </StyledContainer>
  );
};

export default C;
