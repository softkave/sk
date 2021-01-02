import { Typography } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import cloneWithWidth from "../styled/cloneWithWidth";
import StyledContainer from "../styled/Container";
import UserAvatar from "./UserAvatar";

export interface ICollaboratorThumbnailProps {
    collaborator: IUser;
    style?: React.CSSProperties;
    className?: string;
    onClick?: () => void;
}

const CollaboratorThumbnail: React.SFC<ICollaboratorThumbnailProps> = (
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
            {cloneWithWidth(
                <StyledContainer
                    s={{
                        flex: 1,
                        marginLeft: 16,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography.Text ellipsis>
                        {collaborator.name}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                        {collaborator.email}
                    </Typography.Text>
                </StyledContainer>,
                { marginLeft: 16 }
            )}
        </StyledContainer>
    );
};

export default CollaboratorThumbnail;
