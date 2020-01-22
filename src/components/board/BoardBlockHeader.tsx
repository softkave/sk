import styled from "@emotion/styled";
import { Dropdown, Icon, Menu } from "antd";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import StyledDrawerMenu from "../styled/StyledDrawerMenu";

type CreateMenuKey = BlockType | "collaborator";
type SettingsMenuKey = "edit" | "delete";

const StyledContainerAsH1 = StyledContainer.withComponent("h1");

export interface IBoardBlockHeaderProps {
  block: IBlock;
  onClickCreateNewBlock: (type: BlockType) => void;
  onClickAddCollaborator: () => void;
  onClickEditBlock: () => void;
  onClickDeleteBlock: () => void;
  onNavigateBack: () => void;
}

const BoardBlockHeader: React.FC<IBoardBlockHeaderProps> = props => {
  const {
    onNavigateBack,
    block,
    onClickAddCollaborator,
    onClickCreateNewBlock,
    onClickDeleteBlock,
    onClickEditBlock
  } = props;
  const blockTypeFullName = getBlockTypeFullName(block.type);
  const hasCollaborators = block.type === "org";
  const childrenTypes = useBlockChildrenTypes(block);
  const onSelectCreateMenuItem = (key: CreateMenuKey) => {
    switch (key) {
      case "group":
      case "project":
      case "task":
      case "org":
        onClickCreateNewBlock(key as BlockType);
        break;

      case "collaborator":
        onClickAddCollaborator();
        break;
    }
  };

  const createMenuItems = childrenTypes.map(type => (
    <StyledMenuItem key={type}>Create {type}</StyledMenuItem>
  ));

  if (hasCollaborators) {
    createMenuItems.push(<Menu.Divider key="menu-divider-1" />);
    createMenuItems.push(
      <StyledMenuItem key="collaborator">Add Collaborator</StyledMenuItem>
    );
  }

  const createMenu = (
    <StyledDrawerMenu
      onClick={event => onSelectCreateMenuItem(event.key as CreateMenuKey)}
    >
      {createMenuItems}
    </StyledDrawerMenu>
  );

  const onSelectSettingsMenuItem = (key: SettingsMenuKey) => {
    switch (key) {
      case "edit":
        onClickEditBlock();
        break;

      case "delete":
        onClickDeleteBlock();
        break;
    }
  };

  const settingsMenu = (
    <StyledDrawerMenu
      onClick={event => onSelectSettingsMenuItem(event.key as SettingsMenuKey)}
    >
      <StyledMenuItem key="edit">Edit {blockTypeFullName}</StyledMenuItem>
      <StyledMenuItem key="delete">Delete {blockTypeFullName}</StyledMenuItem>
    </StyledDrawerMenu>
  );

  return (
    <StyledContainer s={{ width: "100%", alignItems: "center" }}>
      {/* <StyledFlatButton onClick={onNavigateBack}>
        <Icon type="arrow-left" />
      </StyledFlatButton> */}
      <StyledContainer>
        <ItemAvatar color={block.color} />
      </StyledContainer>
      <StyledContainerAsH1
        s={{
          fontSize: "18px",
          textOverflow: "ellipsis",
          flex: 1,
          margin: "0 16px"
        }}
      >
        {block.name}
      </StyledContainerAsH1>
      <Dropdown overlay={createMenu} trigger={["click"]}>
        <StyledFlatButton icon="plus" />
      </Dropdown>
      <Dropdown overlay={settingsMenu} trigger={["click"]}>
        <StyledFlatButton style={{ paddingLeft: "16px" }}>
          <Icon type="setting" />
        </StyledFlatButton>
      </Dropdown>
    </StyledContainer>
  );
};

export default BoardBlockHeader;

const StyledMenuItem = styled(Menu.Item)({
  textTransform: "capitalize",
  display: "flex"
});
