import styled from "@emotion/styled";
import React from "react";

import { IBlock } from "../../models/block/block";
import GroupBody from "./GroupBody";
import GroupHeader from "./GroupHeader";
import {
  StyledGroupContainer,
  StyledGroupContainerInner
} from "./StyledGroupContainer";

export interface IGroupErrorProps {
  group: IBlock;
}

const GroupError = React.memo<IGroupErrorProps>(props => {
  const { group } = props;

  return (
    <StyledGroupContainer>
      <StyledGroupContainerInner>
        <GroupHeader disabled name={group.name} />
        <GroupBody>
          <StyledGroupLoadingBody>Error loading data</StyledGroupLoadingBody>
        </GroupBody>
      </StyledGroupContainerInner>
    </StyledGroupContainer>
  );
});

const StyledGroupLoadingBody = styled.div({
  padding: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

export default GroupError;
