import React from "react";
import { IBlock } from "../../models/block/block";
import GeneralError from "../GeneralError";
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
          <GeneralError>Error loading data</GeneralError>
        </GroupBody>
      </StyledGroupContainerInner>
    </StyledGroupContainer>
  );
});

export default GroupError;
