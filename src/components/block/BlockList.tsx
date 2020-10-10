import { isFunction } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail, {
    BlockThumbnailShowField,
    IBlockThumbnailProps,
} from "../block/BlockThumnail";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import List from "../styled/List";

export interface IBlockListProps {
    blocks: IBlock[];

    searchQuery?: string;
    blockThumbnailProps?: Partial<IBlockThumbnailProps>;
    showFields?: BlockThumbnailShowField[];
    emptyDescription?: string | React.ReactNode;
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
            getBlockStyle,
            searchQuery,
        } = this.props;

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
            return <EmptyMessage>Blocks not found</EmptyMessage>;
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
