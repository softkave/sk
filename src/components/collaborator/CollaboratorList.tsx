import { css } from "@emotion/css";
import React from "react";
import { useSelector } from "react-redux";
import { ICollaborator } from "../../models/collaborator/types";
import { IAppOrganization } from "../../models/organization/types";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import Message from "../PageError";
import List from "../styled/List";
import CollaboratorThumbnail from "./CollaboratorThumbnail";

export interface ICollaboratorListProps {
  organization: IAppOrganization;
  searchQuery?: string;
}

const classes = {
  item: css({ padding: "8px 16px" }),
};

const CollaboratorList: React.FC<ICollaboratorListProps> = (props) => {
  const { organization, searchQuery } = props;
  const collaborators = useSelector<IAppState, ICollaborator[]>((state) =>
    UserSelectors.getMany(state, organization.collaboratorIds)
  );

  const filteredCollaborators = React.useMemo(() => {
    if (!searchQuery) {
      return collaborators;
    }

    const lowerCasedSearchQuery = searchQuery.toLowerCase();
    return collaborators.filter((user) =>
      user.name.toLowerCase().includes(lowerCasedSearchQuery)
    );
  }, [collaborators, searchQuery]);

  if (collaborators.length === 0) {
    return <Message message="Add a collaborator to get started." />;
  }

  if (filteredCollaborators.length === 0) {
    return <Message message="Collaborator not found." />;
  }

  const renderItem = (collaborator: ICollaborator) => {
    return (
      <div key={collaborator.customId} className={classes.item}>
        <CollaboratorThumbnail collaborator={collaborator} />
      </div>
    );
  };

  return <List dataSource={filteredCollaborators} renderItem={renderItem} />;
};

export default CollaboratorList;
