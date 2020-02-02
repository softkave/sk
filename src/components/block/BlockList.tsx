import styled from "@emotion/styled";
import { isFunction } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail, {
  BlockThumbnailShowField,
  IBlockThumbnailProps
} from "../block/BlockThumnail";
import List from "../styled/List";

export interface IBlockListProps {
  blocks: IBlock[];
  showExploreMenu?: boolean;
  showFields?: BlockThumbnailShowField[];
  emptyDescription?: string | React.ReactNode;
  itemStyle?: React.CSSProperties;
  onClick?: (block: IBlock) => void;
  onClickChildMenuItem?: IBlockThumbnailProps["onClickChildMenuItem"];
}

class BlockList extends React.PureComponent<IBlockListProps> {
  public render() {
    const {
      blocks,
      onClick,
      showFields,
      emptyDescription,
      itemStyle,
      showExploreMenu,
      onClickChildMenuItem
    } = this.props;

    return (
      <List
        dataSource={blocks}
        rowKey="customId"
        emptyDescription={emptyDescription}
        renderItem={block => (
          <StyledBlockThumbnailContainer style={itemStyle}>
            <BlockThumbnail
              block={block}
              showExploreMenu={showExploreMenu}
              showFields={showFields}
              onClick={() => isFunction(onClick) && onClick(block)}
              onClickChildMenuItem={onClickChildMenuItem}
            />
          </StyledBlockThumbnailContainer>
        )}
      />
    );
  }
}

const StyledBlockThumbnailContainer = styled.div({
  padding: "16px"
});

export default BlockList;
