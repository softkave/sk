import { isFunction } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail, {
  BlockThumbnailShowField,
  IBlockThumbnailProps,
} from "../block/BlockThumnail";
import Message from "../Message";
import StyledContainer from "../styled/Container";
import List from "../styled/List";

export interface IBlockListProps {
  blocks: IBlock[];
  searchQuery?: string;
  blockThumbnailProps?: Partial<IBlockThumbnailProps>;
  showFields?: BlockThumbnailShowField[];
  emptyDescription?: string;
  notFoundMessage?: string;
  onClick?: (block: IBlock) => void;
  getBlockStyle?: (block: IBlock, index: number) => React.CSSProperties;
}

class BlockList extends React.PureComponent<IBlockListProps> {
  public render() {
    const {
      blocks,
      onClick,
      showFields,
      emptyDescription,
      notFoundMessage,
      getBlockStyle,
      searchQuery,
    } = this.props;

    if (blocks.length === 0) {
      return <Message message={emptyDescription || "Empty."} />;
    }

    const filterBlocks = () => {
      if (!searchQuery) {
        return blocks;
      }

      const lowerCasedSearchQuery = searchQuery.toLowerCase();
      return blocks.filter((block) =>
        block.name?.toLowerCase().includes(lowerCasedSearchQuery)
      );
    };

    const filteredBlocks = filterBlocks();

    if (filteredBlocks.length === 0) {
      return <Message message={notFoundMessage || "Block not found."} />;
    }

    return (
      <List
        dataSource={filteredBlocks}
        emptyDescription={emptyDescription}
        renderItem={(block, i) => (
          <StyledContainer
            key={block.customId}
            s={getBlockStyle ? getBlockStyle(block, i) : undefined}
            onClick={() => isFunction(onClick) && onClick(block)}
          >
            <BlockThumbnail block={block} showFields={showFields} />
          </StyledContainer>
        )}
      />
    );
  }
}

export default BlockList;
