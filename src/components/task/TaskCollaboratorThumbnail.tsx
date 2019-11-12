import styled from "@emotion/styled";
import { Button, Switch, Typography } from "antd";
import React from "react";
import { ITaskCollaborator } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";

export interface ITaskCollaboratorThumbnailProps {
  collaborator: IUser;
  taskCollaborator: ITaskCollaborator;
  onUnassign: () => void;
}

const TaskCollaboratorThumbnail: React.SFC<
  ITaskCollaboratorThumbnailProps
> = props => {
  const { collaborator, taskCollaborator, onUnassign } = props;

  return (
    <StyledContainer>
      <ItemAvatar color={collaborator.color} />
      <StyledCollaboratorNameContainer>
        <Typography.Text strong ellipsis>
          {collaborator.name}
        </Typography.Text>
      </StyledCollaboratorNameContainer>
      <Switch
        disabled={true}
        checked={!!taskCollaborator.completedAt}
        onChange={() => null}
        style={{ marginRight: "16px" }}
      />
      <Button type="danger" icon="close" onClick={onUnassign} />
    </StyledContainer>
  );
};

export default TaskCollaboratorThumbnail;

const StyledContainer = styled.div({
  display: "flex"
});

const StyledCollaboratorNameContainer = styled.div({
  flex: 1
});
