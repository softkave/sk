import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";
import StyledContainer from "../styled/Container";

export interface IGroupListProps {
  groups: IBlock[];
  onClick?: (group: IBlock) => void;
}

const GroupList: React.FC<IGroupListProps> = props => {
  const { groups, onClick } = props;

  return (
    <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
      <BlockList
        blocks={groups}
        showFields={["name"]}
        emptyDescription="No groups available."
        onClick={onClick}
      />
    </StyledContainer>
  );
};

export default GroupList;
