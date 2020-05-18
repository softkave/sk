import styled from "@emotion/styled";
import { isFunction } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail, {
  BlockThumbnailShowField,
} from "../block/BlockThumnail";
import List from "../styled/List";

export interface IBlockListProps {
  blocks: IBlock[];
  showFields?: BlockThumbnailShowField[];
  emptyDescription?: string | React.ReactNode;
  onClick?: (block: IBlock) => void;
}

class BlockList extends React.PureComponent<IBlockListProps> {
  public render() {
    const { blocks, onClick, showFields, emptyDescription } = this.props;

    return (
      <List
        dataSource={blocks}
        rowKey="customId"
        emptyDescription={emptyDescription}
        renderItem={(block, i) => (
          <StyledBlockThumbnailContainer
            key={block.customId}
            style={{ paddingTop: i === 0 ? 0 : undefined }}
          >
            <BlockThumbnail
              block={block}
              showFields={showFields}
              onClick={() => isFunction(onClick) && onClick(block)}
            />
          </StyledBlockThumbnailContainer>
        )}
      />
    );
  }
}

const StyledBlockThumbnailContainer = styled.div({
  padding: "16px 0",
});

export default BlockList;
