import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";
import StyledFlexColumnContainer from "../styled/ColumnContainer";

export interface IGroupListProps {
  groups: IBlock[];
  onClick?: (group: IBlock) => void;
}

const GroupList: React.FC<IGroupListProps> = props => {
  const { groups, onClick } = props;

  return (
    <StyledFlexColumnContainer>
      <h1>Groups</h1>
      <BlockList
        blocks={groups}
        showFields={["name"]}
        emptyDescription="No groups available."
        itemStyle={{ padding: "16px 0" }}
        onClick={onClick}
      />
    </StyledFlexColumnContainer>
  );
};

export default GroupList;
