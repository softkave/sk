import { Select } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";

export interface IBlockParentSelectionProps {
  parents: IBlock[];
  value?: IBlock;
}

const BlockParentSelection: React.SFC<IBlockParentSelectionProps> = props => {
  return <Select placeholder="Parent"></Select>;
};

export default BlockParentSelection;
