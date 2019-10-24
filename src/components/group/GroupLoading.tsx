import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";

import { IBlock } from "../../models/block/block";
import GroupBody from "./GroupBody";
import GroupHeader from "./GroupHeader";
import {
  StyledGroupContainer,
  StyledGroupContainerInner
} from "./StyledGroupContainer";

export interface IGroupLoadingProps {
  group: IBlock;
}

const GroupLoading = React.memo<IGroupLoadingProps>(props => {
  const { group } = props;

  return (
    <StyledGroupContainer>
      <StyledGroupContainerInner>
        <GroupHeader disabled name={group.name} />
        <GroupBody>
          <StyledGroupLoadingBody>
            <StyledLoadingIcon type="loading" />
          </StyledGroupLoadingBody>
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

const StyledLoadingIcon = styled(Icon)({
  fontSize: "24px",
  color: "rgb(66,133,244)"
});

export default GroupLoading;
