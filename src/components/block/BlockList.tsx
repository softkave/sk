import styled from "@emotion/styled";
import { isFunction } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail, {
  BlockThumbnailShowField,
} from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import List from "../styled/List";

export interface IBlockListProps {
  blocks: IBlock[];
  borderTop?: boolean;
  padWidth?: boolean;
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
    } = this.props;

    const getBorderTop = !border
      ? () => undefined
      : borderTop
      ? (i: number) => "1px solid #d9d9d9"
      : (i: number) => (i === 0 ? undefined : "1px solid #d9d9d9");
    const padding = padWidth ? "16px" : "16px 0";

    return (
      <List
        dataSource={blocks}
        emptyDescription={emptyDescription}
        renderItem={(block, i) => (
          <StyledContainer
            key={block.customId}
            s={{
              padding,
              borderTop: getBorderTop(i),
              // "&:hover": {
              //   backgroundColor: "#fafafa",
              // },
            }}
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
