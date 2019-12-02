import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";

export interface IGroupListProps {
  groups: IBlock[];
}

const GroupList: React.FC<IGroupListProps> = props => {
  const { groups } = props;

  return (
    <BlockList
      blocks={groups}
      showFields={["name"]}
      emptyDescription="No groups available."
      itemStyle={{ padding: "16px" }}
    />
  );
};

export default GroupList;
