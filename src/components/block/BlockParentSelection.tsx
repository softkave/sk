import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import React from "react";
import { findBlock, IBlock } from "../../models/block/block";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import BlockThumbnail from "./BlockThumnail";

export interface IBlockParentSelectionProps {
  possibleParents: IBlock[];

  disabled?: boolean;
  value?: string;
  onChange?: (parentID: string) => void;
}

const BlockParentSelection: React.SFC<IBlockParentSelectionProps> = (props) => {
  const { value, possibleParents, onChange, disabled } = props;

  React.useEffect(() => {
    if (!value && possibleParents.length === 1 && onChange) {
      onChange(possibleParents[0].customId);
    }
  });

  const selectParent = (id: string) => {
    if (onChange) {
      const parent = findBlock(possibleParents, id)!;
      onChange(parent.customId);
    }
  };

  const parentsMenu = (
    <Menu
      onClick={(event) => selectParent(event.key)}
      style={{ maxHeight: "300px", overflowY: "auto" }}
    >
      {possibleParents.map((parent) => (
        <Menu.Item key={parent.customId}>
          <BlockThumbnail block={parent} />
        </Menu.Item>
      ))}
    </Menu>
  );

  const renderSelectedParent = () => {
    if (value) {
      const immediateParentID = value;
      const immediateParent = findBlock(possibleParents, immediateParentID);

      if (immediateParent) {
        return <BlockThumbnail block={immediateParent} />;
      } else {
        return <ItemAvatar />;
      }
    }

    return "Select parent block";
  };

  const renderDropdownContent = () => {
    return (
      <StyledContainer s={{ cursor: disabled ? "not-allowed" : "pointer" }}>
        <StyledContainer s={{ display: "flex", flex: 1, marginRight: "16px" }}>
          {renderSelectedParent()}
        </StyledContainer>
        <StyledContainer
          s={{
            alignItems: "center",
            fontSize: "16px",
          }}
        >
          <CaretDownOutlined />
        </StyledContainer>
      </StyledContainer>
    );
  };

  if (disabled) {
    return renderDropdownContent();
  }

  return (
    <Dropdown overlay={parentsMenu} trigger={["click"]}>
      {renderDropdownContent()}
    </Dropdown>
  );
};

export default BlockParentSelection;
