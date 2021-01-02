import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import React from "react";
import { Trash2 } from "react-feather";
import { SizeMe } from "react-sizeme";
import { IUser } from "../../models/user/user";
import UserAvatar from "../collaborator/UserAvatar";
import StyledContainer from "../styled/Container";

export interface ITaskCollaboratorThumbnailProps {
    collaborator: IUser;
    onUnassign: () => void;

    disabled?: boolean;
}

const TaskCollaboratorThumbnail: React.SFC<ITaskCollaboratorThumbnailProps> = (
    props
) => {
    const { collaborator, onUnassign, disabled } = props;

    return (
        <StyledContainer
            s={{
                width: "100%",
            }}
        >
            <UserAvatar user={collaborator} />
            <SizeMe>
                {({ size }) => (
                    <StyledCollaboratorNameContainer
                        style={{ width: size.width! }}
                    >
                        <Typography.Text ellipsis>
                            {collaborator.name}
                        </Typography.Text>
                    </StyledCollaboratorNameContainer>
                )}
            </SizeMe>
            <StyledContainer s={{ alignItems: "center" }}>
                <Button
                    disabled={disabled}
                    icon={<Trash2 />}
                    onClick={onUnassign}
                    htmlType="button"
                    className="icon-btn"
                />
            </StyledContainer>
        </StyledContainer>
    );
};

export default TaskCollaboratorThumbnail;

const StyledCollaboratorNameContainer = styled.div({
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    display: "flex",
    alignItems: "center",
});
