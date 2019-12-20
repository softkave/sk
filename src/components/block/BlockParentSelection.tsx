import { Dropdown, Icon, Menu } from "antd";
import React from "react";
import { findBlock, IBlock } from "../../models/block/block";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import BlockThumbnail from "./BlockThumnail";
import { makeBlockParentIDs } from "./getNewBlock";

export interface IBlockParentSelectionProps {
  parents: IBlock[];
  value?: string[];
  onChange?: (parentIDs: string[]) => void;
}

const BlockParentSelection: React.SFC<IBlockParentSelectionProps> = props => {
  const { value, parents, onChange } = props;
  const hasValue = Array.isArray(value) && value.length > 0;

  React.useEffect(() => {
    if (!hasValue && parents.length === 1 && onChange) {
      onChange(makeBlockParentIDs(parents[0]));
    }
  });

  const selectParent = (id: string) => {
    if (onChange) {
      const parent = findBlock(parents, id)!;
      const blockParentIDs = makeBlockParentIDs(parent);
      onChange(blockParentIDs);
    }
  };

  const parentsMenu = (
    <Menu onClick={event => selectParent(event.key)}>
      {parents.map(parent => (
        <Menu.Item key={parent.customId}>
          <BlockThumbnail block={parent} />
        </Menu.Item>
      ))}
    </Menu>
  );

  const renderSelectedParent = () => {
    if (value) {
      const immediateParentID = value[value.length - 1];
      const immediateParent = findBlock(parents, immediateParentID);

      if (immediateParent) {
        return <BlockThumbnail block={immediateParent} />;
      } else {
        return <ItemAvatar />;
      }
    }

    return "Select parent block";
  };

  return (
    <Dropdown overlay={parentsMenu} trigger={["click"]}>
      <StyledContainer s={{ cursor: "pointer" }}>
        <StyledContainer s={{ display: "flex", flex: 1, marginRight: "16px" }}>
          {renderSelectedParent()}
        </StyledContainer>
        <StyledContainer
          s={{
            alignItems: "center",
            fontSize: "16px"
          }}
        >
          <Icon type="caret-down" />
        </StyledContainer>
      </StyledContainer>
    </Dropdown>
  );
};

export default BlockParentSelection;
