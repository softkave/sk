import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import CollaboratorThumbnail from "./CollaboratorThumbnail";

export interface ICProps {
  organization: IBlock;
}

const CollaboratorList: React.FC<ICProps> = (props) => {
  const { organization } = props;
  console.log({ props });
  const collaborators = useSelector<IAppState, IUser[]>((state) =>
    UserSelectors.getUsers(state, organization.collaborators!)
  );

  if (collaborators.length === 0) {
    return <EmptyMessage>No collaborators yet.</EmptyMessage>;
  }

  const renderItem = (collaborator: IUser, i: number) => {
    return (
      <StyledContainer
        key={collaborator.customId}
        s={{
          padding: "16px 0",
          borderTop: i === 0 ? undefined : "1px solid #d9d9d9",
        }}
      >
        <CollaboratorThumbnail collaborator={collaborator} />
      </StyledContainer>
    );
  };

  return <List dataSource={collaborators} renderItem={renderItem} />;
};

export default CollaboratorList;
