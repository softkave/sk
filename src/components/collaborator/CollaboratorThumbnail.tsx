import { Typography } from "antd";
import React from "react";
import { ICollaborator } from "../../models/user/user";
import StyledContainer from "../styled/Container";
import UserAvatar from "./UserAvatar";

export interface ICollaboratorThumbnailProps {
    collaborator: ICollaborator;
    style?: React.CSSProperties;
    className?: string;
    onClick?: () => void;
}

const CollaboratorThumbnail: React.FC<ICollaboratorThumbnailProps> = (
    props
) => {
    const { collaborator, style, onClick, className } = props;

    return (
        <StyledContainer
            s={{ width: "100%" }}
            style={style}
            onClick={onClick}
            className={className}
        >
            <UserAvatar user={collaborator} />
            <StyledContainer
                s={{
                    flex: 1,
                    marginLeft: 16,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography.Text ellipsis>{collaborator.name}</Typography.Text>
                <Typography.Text ellipsis type="secondary">
                    {collaborator.email}
                </Typography.Text>
            </StyledContainer>
        </StyledContainer>
    );
};

export default CollaboratorThumbnail;
