import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { findBlock, IBlock } from "../../models/block/block";
import ItemAvatar from "../ItemAvatar";

import BlockThumbnail from "./BlockThumnail";

export interface IBlockParentSelectionProps {
  possibleParents: IBlock[];

  disabled?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (parentId: string) => void;
}

const BlockParentSelection: React.FC<IBlockParentSelectionProps> = (props) => {
  const { value, possibleParents, placeholder, disabled, onChange } = props;
  const [parentsMap] = React.useState(() => {
    return possibleParents.reduce((accumulator, p) => {
      accumulator[p.customId] = p;
      return accumulator;
    }, {} as { [key: string]: IBlock });
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
      selectedKeys={value ? [value] : undefined}
    >
      {possibleParents.map((parent) => (
        <Menu.Item key={parent.customId}>
          <BlockThumbnail
            block={parent}
            parent={parent.parent ? parentsMap[parent.parent] : undefined}
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

    return placeholder || "Select parent block";
  };

  const renderDropdownContent = () => {
    return (
      <div style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
        <Space>
          {renderSelectedParent()}
          <CaretDownOutlined style={{ color: "#999", fontSize: "10px" }} />
        </Space>
      </div>
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
