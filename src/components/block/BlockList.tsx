import styled from "@emotion/styled";
import { isFunction } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail, {
  BlockThumbnailShowField
} from "../block/BlockThumnail";
import ScrollList from "../ScrollList";
import List from "../styled/List";

export interface IBlockListProps {
  blocks: IBlock[];
  showFields?: BlockThumbnailShowField[];
  emptyDescription?: string | React.ReactNode;
  itemStyle?: React.CSSProperties;
  onClick?: (block: IBlock) => void;
}

class BlockList extends React.PureComponent<IBlockListProps> {
  public render() {
    const {
      blocks,
      onClick,
      showFields,
      emptyDescription,
      itemStyle
    } = this.props;

    return (
      <ScrollList>
        <List
          dataSource={blocks}
          rowKey="customId"
          emptyDescription={emptyDescription}
          renderItem={block => (
            <StyledBlockThumbnailContainer style={itemStyle}>
              <BlockThumbnail
                block={block}
                showFields={showFields}
                onClick={() => isFunction(onClick) && onClick(block)}
              />
            </StyledBlockThumbnailContainer>
          )}
        />
      </ScrollList>
    );
  }
}

const StyledBlockThumbnailContainer = styled.div({
  padding: "24px"
});

export default BlockList;
