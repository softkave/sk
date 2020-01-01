import styled from "@emotion/styled";
import { Dropdown, Icon, Menu } from "antd";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import StyledDrawerMenu from "../styled/StyledDrawerMenu";

type CreateMenuKey = BlockType | "collaborator";
type SettingsMenuKey = "edit" | "delete";

export interface IBoardBlockHeaderProps {
  block: IBlock;
  onClickCreateNewBlock: (type: BlockType) => void;
  onClickAddCollaborator: () => void;
  onClickEditBlock: () => void;
  onClickDeleteBlock: () => void;
  onNavigateBack?: (() => void) | null;
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
    <StyledContainer
      s={{ width: "100%", alignItems: "center", marginBottom: "12px" }}
    >
      {onNavigateBack && (
        <StyledFlatButton
          style={{ paddingRight: "16px" }}
          onClick={onNavigateBack}
        >
          <Icon type="caret-left" theme="filled" />
        </StyledFlatButton>
      )}
      <StyledHeaderName>{block.name}</StyledHeaderName>
      <div>
        <Dropdown overlay={createMenu} trigger={["click"]}>
          <StyledFlatButton icon="plus" />
        </Dropdown>
        <Dropdown overlay={settingsMenu} trigger={["click"]}>
          <StyledFlatButton style={{ paddingLeft: "16px" }}>
            <Icon type="setting" />
          </StyledFlatButton>
        </Dropdown>
      </div>
    </StyledContainer>
  );
};

export default BoardBlockHeader;

const StyledMenuItem = styled(Menu.Item)({
  fontSize: "14px",
  textTransform: "capitalize",
  display: "flex"
});

const StyledHeaderName = styled.h1({
  display: "flex",
  flex: 1,
  marginRight: "16px",
  fontSize: "24px",
  marginBottom: "0"
});
