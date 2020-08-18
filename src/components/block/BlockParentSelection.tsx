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
  onChange?: (parentId: string) => void;
}

const BlockParentSelection: React.SFC<IBlockParentSelectionProps> = (props) => {
  const { value, possibleParents, onChange, disabled } = props;
  const [parentsMap] = React.useState(() => {
    return possibleParents.reduce((accumulator, p) => {
      accumulator[p.customId] = p;
      return accumulator;
    }, {});
  });

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
      onClick={(event) => selectParent(event.key as string)}
      style={{ maxHeight: "300px", overflowY: "auto" }}
    >
      {possibleParents.map((parent) => (
        <Menu.Item key={parent.customId}>
          <BlockThumbnail
            block={parent}
            parent={parent.parent && parentsMap[parent.parent]}
            style={{ marginBottom: "16px" }}
          />
        </Menu.Item>
      ))}
    </Menu>
  );

  const renderSelectedParent = () => {
    if (value) {
      const immediateParentId = value;
      const immediateParent = findBlock(possibleParents, immediateParentId);

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
