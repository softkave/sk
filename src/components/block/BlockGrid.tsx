import styled from "@emotion/styled";
import { Col, Row } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail, {
  BlockThumbnailShowField,
} from "../block/BlockThumnail";
import EmptyMessage from "../EmptyMessage";

export interface IBlockGridProps {
  blocks: IBlock[];

  style?: React.CSSProperties;
  showFields?: BlockThumbnailShowField[];
  emptyDescription?: string | React.ReactNode;
  onClick?: (block: IBlock) => void;
}

class BlockGrid extends React.PureComponent<IBlockGridProps> {
  public render() {
    const { blocks, onClick, showFields, emptyDescription, style } = this.props;

    if (blocks.length === 0) {
      return <EmptyMessage>{emptyDescription}</EmptyMessage>;
    }

    return (
      <Row gutter={[32, 32]} style={style}>
        {blocks.map((block) => (
          <Col
            key={block.customId}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={6}
            xxl={4}
          >
            <BlockThumbnail
              block={block}
              showFields={showFields}
              onClick={() => onClick && onClick(block)}
            />
          </Col>
        ))}
      </Row>
    );
  }
}

export default BlockGrid;
