import styled from "@emotion/styled";
import { isFunction } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail, {
  BlockThumbnailShowField,
  IBlockThumbnailProps,
} from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import List from "../styled/List";

export interface IBlockListProps {
  blocks: IBlock[];
  getBlockStyle?: (block: IBlock, index: number) => React.CSSProperties;

  blockThumbnailProps?: Partial<IBlockThumbnailProps>;
  borderTop?: boolean;
  padWidth?: boolean;
  paddingNum?: number;
  border?: boolean;
  showFields?: BlockThumbnailShowField[];
  emptyDescription?: string | React.ReactNode;
  onClick?: (block: IBlock) => void;
}

class BlockList extends React.PureComponent<IBlockListProps> {
  public render() {
    const {
      blocks,
      onClick,
      showFields,
      emptyDescription,
      borderTop,
      padWidth,
      border,
      blockThumbnailProps,
      paddingNum,
      getBlockStyle,
    } = this.props;

    return (
      <List
        dataSource={blocks}
        emptyDescription={emptyDescription}
        renderItem={(block, i) => (
          <StyledContainer
            key={block.customId}
            s={getBlockStyle ? getBlockStyle(block, i) : undefined}
          >
            <BlockThumbnail
              block={block}
              showFields={showFields}
              onClick={() => isFunction(onClick) && onClick(block)}
            />
          </StyledContainer>
        )}
      />
    );
  }
}

export default BlockList;
