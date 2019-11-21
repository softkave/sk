import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import StyledFlatButton from "../styled/FlatButton";

export interface ISubTaskValues {
  description: string;
}

export interface ISubTaskProps {
  subTask: ISubTaskValues;
  onEdit: () => void;
  onDelete: () => void;
}

const SubTask: React.SFC<ISubTaskProps> = props => {
  const { subTask, onEdit, onDelete } = props;

  const renderControls = () => {
    return (
      <React.Fragment>
        <StyledFlatButton icon="edit" onClick={onEdit} />
        <StyledFlatButton icon="delete" onClick={onDelete} />
      </React.Fragment>
    );
  };

  const renderDescriptionText = () => {
    return <Typography.Text ellipsis>{subTask.description}</Typography.Text>;
  };

  return (
    <StyledSubTaskContainer>
      <StyledDescriptionContainer>
        {renderDescriptionText()}
      </StyledDescriptionContainer>
      <StyledControlsContainer>{renderControls()}</StyledControlsContainer>
    </StyledSubTaskContainer>
  );
};

export default SubTask;

const StyledSubTaskContainer = styled.div({
  display: "flex"
});

const StyledDescriptionContainer = styled.div({
  display: "flex",
  flex: "1"
});

const StyledControlsContainer = styled.div({
  marginLeft: "16px"
});
