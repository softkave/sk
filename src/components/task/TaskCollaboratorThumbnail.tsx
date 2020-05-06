import { DeleteFilled } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Switch, Typography } from "antd";
import React from "react";
import { SizeMe } from "react-sizeme";
import {
  ITaskCollaborator,
  TaskCollaborationType,
} from "../../models/block/block";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";

export interface ITaskCollaboratorThumbnailProps {
  collaborator: IUser;
  taskCollaborator: ITaskCollaborator;
  collaborationType: TaskCollaborationType;
  onUnassign: () => void;

  disabled?: boolean;
}

const TaskCollaboratorThumbnail: React.SFC<ITaskCollaboratorThumbnailProps> = (
  props
) => {
  const {
    collaborator,
    taskCollaborator,
    onUnassign,
    collaborationType,
    disabled,
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
      <StyledContainer s={{ alignItems: "center" }}>
        {collaborationType === "individual" && (
          <Switch
            disabled={true}
            checked={!!taskCollaborator.completedAt}
            onChange={() => null}
            style={{ marginRight: "16px" }}
          />
        )}
        <StyledFlatButton
          onClick={onUnassign}
          style={{ color: "rgb(255, 77, 79)" }}
          disabled={disabled}
        >
          <DeleteFilled />
        </StyledFlatButton>
      </StyledContainer>
    </StyledMainContainer>
  );
};

export default TaskCollaboratorThumbnail;

const StyledMainContainer = styled.div({
  display: "flex",
  width: "100%",
});

const StyledCollaboratorNameContainer = styled.div({
  flex: 1,
  marginLeft: 16,
  marginRight: 16,
  display: "flex",
  alignItems: "center",
});
