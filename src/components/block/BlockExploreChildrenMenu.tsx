import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import React from "react";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import BlockChildrenMenuItems, {
  IBlockChildrenMenuItemsProps
} from "./BlockChildrenMenuItems";

export interface IBlockExploreChildrenMenuProps {
  block: IBlock;
  onClick: IBlockChildrenMenuItemsProps["onClick"];
}

const BlockExploreChildrenMenu: React.FC<IBlockExploreChildrenMenuProps> = props => {
  const { block, onClick } = props;
  const [isExploreExpanded, setExpand] = React.useState(false);

  const toggleExpand = () => setExpand(!isExploreExpanded);

  return (
    <StyledContainer s={{ flexDirection: "column" }}>
      <StyledFlatButton onClick={toggleExpand} style={{ textAlign: "left" }}>
        {isExploreExpanded ? (
          <CaretDownOutlined
            style={{ marginRight: "16px", fontSize: "14px" }}
          />
        ) : (
          <CaretRightOutlined
            style={{ marginRight: "16px", fontSize: "14px" }}
          />
        )}
        Explore - {isExploreExpanded ? "Collapse" : "Expand"}
      </StyledFlatButton>
      {isExploreExpanded && (
        <BlockChildrenMenuItems block={block} onClick={onClick} />
      )}
    </StyledContainer>
  );
};

export default BlockExploreChildrenMenu;
