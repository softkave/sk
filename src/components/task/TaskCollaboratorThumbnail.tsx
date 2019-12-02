import styled from "@emotion/styled";
import { Button, Switch, Typography } from "antd";
import React from "react";
import { SizeMe } from "react-sizeme";
import { ITaskCollaborator } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";

export interface ITaskCollaboratorThumbnailProps {
  collaborator: IUser;
  taskCollaborator: ITaskCollaborator;
  onUnassign: () => void;
}

const TaskCollaboratorThumbnail: React.FC<ITaskCollaboratorThumbnailProps> = props => {
  const { collaborator, taskCollaborator, onUnassign } = props;

  return (
    <StyledContainer>
      <ItemAvatar color={collaborator.color} />
      <SizeMe>
        {({ size }) => (
          <StyledCollaboratorNameContainer style={{ width: size.width! }}>
            <Typography.Text strong ellipsis>
              {collaborator.name}
            </Typography.Text>
          </StyledCollaboratorNameContainer>
        )}
      </SizeMe>
      <div>
        <Switch
          disabled={true}
          checked={!!taskCollaborator.completedAt}
          onChange={() => null}
          style={{ marginRight: "16px" }}
        />
        <Button type="danger" icon="delete" onClick={onUnassign} />
      </div>
    </StyledContainer>
  );
};

export default TaskCollaboratorThumbnail;

const StyledContainer = styled.div({
  display: "flex",
  width: "100%"
});

const StyledCollaboratorNameContainer = styled.div({
  flex: 1,
  marginLeft: 16,
  marginRight: 16,
  display: "flex"
});
