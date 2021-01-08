import { css } from "@emotion/css";
import { Button, Typography } from "antd";
import React from "react";
import { X } from "react-feather";
import { ICollaborator } from "../../models/user/user";
import UserAvatar from "../collaborator/UserAvatar";
import StyledContainer from "../styled/Container";

export interface IPermissionGroupUserProps {
    collaborator: ICollaborator;
    onRemove: () => void;
    disabled?: boolean;
}

const PermissionGroupUser: React.FC<IPermissionGroupUserProps> = (props) => {
    const { collaborator, onRemove, disabled } = props;

    return (
        <StyledContainer
            s={{
                width: "100%",
            }}
        >
            <UserAvatar user={collaborator} />
            <div
                className={css({
                    flex: 1,
                    marginLeft: 16,
                    marginRight: 16,
                    display: "flex",
                    alignItems: "center",
                })}
            >
                <Typography.Text ellipsis>{collaborator.name}</Typography.Text>
            </div>
            <StyledContainer s={{ alignItems: "center" }}>
                <Button
                    disabled={disabled}
                    icon={<X />}
                    onClick={onRemove}
                    htmlType="button"
                    className="icon-btn"
                />
            </StyledContainer>
        </StyledContainer>
    );
};

export default PermissionGroupUser;
