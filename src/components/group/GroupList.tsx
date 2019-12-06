import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";

export interface IGroupListProps {
  groups: IBlock[];
  onClick?: (group: IBlock) => void; 
}

const GroupList: React.FC<IGroupListProps> = props => {
  const { groups, onClick } = props;

  return (
    <BlockList
      blocks={groups}
      showFields={["name"]}
      emptyDescription="No groups available."
      itemStyle={{ padding: "16px" }}
      onClick={onClick}
    />
  );
};

export default GroupList;
