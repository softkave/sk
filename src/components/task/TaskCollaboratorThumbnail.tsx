import styled from "@emotion/styled";
import { Button, Icon, Switch, Typography } from "antd";
import React from "react";
import { SizeMe } from "react-sizeme";
import {
  ITaskCollaborator,
  TaskCollaborationType
} from "../../models/block/block";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";

const StyledContainerAsButton = StyledContainer.withComponent(Button);

export interface ITaskCollaboratorThumbnailProps {
  collaborator: IUser;
  taskCollaborator: ITaskCollaborator;
  collaborationType: TaskCollaborationType;
  onUnassign: () => void;
}

const TaskCollaboratorThumbnail: React.SFC<ITaskCollaboratorThumbnailProps> = props => {
  const {
    collaborator,
    taskCollaborator,
    onUnassign,
    collaborationType
  } = props;

  return (
    <StyledMainContainer>
      <ItemAvatar color={collaborator.color} />
      <SizeMe>
        {({ size }) => (
          <StyledCollaboratorNameContainer style={{ width: size.width! }}>
            <Typography.Text ellipsis>{collaborator.name}</Typography.Text>
          </StyledCollaboratorNameContainer>
        )}
      </SizeMe>
      <StyledContainer>
        {collaborationType === "individual" && (
          <Switch
            disabled={true}
            checked={!!taskCollaborator.completedAt}
            onChange={() => null}
            style={{ marginRight: "16px" }}
          />
        )}
        <StyledContainerAsButton
          type="danger"
          size="small"
          icon="delete"
          onClick={onUnassign}
          s={{
            alignItems: "center",
            justifyContent: "center",
            ["& .anticon"]: {
              fontSize: "13.33px"
            }
          }}
        />
      </StyledContainer>
    </StyledMainContainer>
  );
};

export default TaskCollaboratorThumbnail;

const StyledMainContainer = styled.div({
  display: "flex",
  width: "100%"
});

const StyledCollaboratorNameContainer = styled.div({
  flex: 1,
  marginLeft: 16,
  marginRight: 16,
  display: "flex",
  alignItems: "center"
});
