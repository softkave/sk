import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import Message from "../Message";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import CollaboratorThumbnail from "./CollaboratorThumbnail";

export interface ICProps {
    organization: IBlock;

    searchQuery?: string;
    getCollaboratorStyle?: (user: IUser, index: number) => React.CSSProperties;
}

const CollaboratorList: React.FC<ICProps> = (props) => {
    const { organization, getCollaboratorStyle, searchQuery } = props;
    const collaborators = useSelector<IAppState, IUser[]>((state) =>
        UserSelectors.getUsers(state, organization.collaborators!)
    );

    if (collaborators.length === 0) {
        return <Message message="Empty!" />;
    }

    const filterCollaborators = () => {
        if (!searchQuery) {
            return collaborators;
        }

        const lowerCasedSearchQuery = searchQuery.toLowerCase();
        return collaborators.filter((user) =>
            user.name.toLowerCase().includes(lowerCasedSearchQuery)
        );
    };

    const filteredCollaborators = filterCollaborators();

    if (filteredCollaborators.length === 0) {
        return <Message message="Collaborator not found!" />;
    }

    const renderItem = (collaborator: IUser, i: number) => {
        return (
            <StyledContainer
                key={collaborator.customId}
                s={
                    getCollaboratorStyle
                        ? getCollaboratorStyle(collaborator, i)
                        : undefined
                }
            >
                <CollaboratorThumbnail collaborator={collaborator} />
            </StyledContainer>
        );
    };

    return <List dataSource={filteredCollaborators} renderItem={renderItem} />;
};

export default CollaboratorList;
