import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IAppState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import CollaboratorThumbnail from "./CollaboratorThumbnail";

export interface ICProps {
  organization: IBlock;
}

const CollaboratorList: React.FC<ICProps> = (props) => {
  const { organization } = props;
  const collaborators = useSelector<IAppState, IUser[]>((state) =>
    getUsersAsArray(state, organization.collaborators!)
  );

  if (collaborators.length === 0) {
    return <EmptyMessage>No collaborators yet.</EmptyMessage>;
  }

  const renderItem = (collaborator: IUser) => {
    return (
      <StyledContainer key={collaborator.customId} s={{ padding: "16px 0" }}>
        <CollaboratorThumbnail collaborator={collaborator} />
      </StyledContainer>
    );
  };

  return <List dataSource={collaborators} renderItem={renderItem} />;
};

export default CollaboratorList;
