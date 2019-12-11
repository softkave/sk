import styled from "@emotion/styled";
import { Select, Typography } from "antd";
import React from "react";
import { findBlock, IBlock } from "../../models/block/block";
import BlockThumbnail from "./BlockThumnail";
import { makeBlockParentIDs } from "./getNewBlock";

export interface IBlockParentSelectionProps {
  parents: IBlock[];
  value?: string[];
  onChange?: (parentIDs: string[]) => void;
}

const BlockParentSelection: React.FC<IBlockParentSelectionProps> = props => {
  const { value, parents, onChange } = props;
  let block: IBlock | undefined;
  const hasValue = Array.isArray(value) && value.length > 0;

  React.useEffect(() => {
    if (!hasValue && parents.length === 1 && onChange) {
      onChange(makeBlockParentIDs(parents[0]));
    }
  });

  if (hasValue) {
    block = value && findBlock(parents, value[value.length - 1]);
  }

  return (
    <StyledContainer>
      <StyledParentContainer>
        {block && <BlockThumbnail block={block} />}
        {!block && <Typography.Text>No parent block selected</Typography.Text>}
      </StyledParentContainer>
      <Select
        placeholder="Select parent block"
        value={undefined}
        onChange={(id: string) => {
          if (onChange) {
            const parent = findBlock(parents, id)!;
            const blockParentIDs = makeBlockParentIDs(parent);
            onChange(blockParentIDs);
          }
        }}
      >
        {parents.map(parent => (
          <Select.Option key={parent.customId} value={parent.customId}>
            <BlockThumbnail block={parent} />
          </Select.Option>
        ))}
      </Select>
    </StyledContainer>
  );
};

export default BlockParentSelection;

// TODO: Consolidate layout containers
const StyledContainer = styled.div({
  display: "flex",
  flexDirection: "column"
});

const StyledParentContainer = styled.div({
  marginBottom: 16
});
