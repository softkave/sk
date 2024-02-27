import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import ItemAvatar from "../ItemAvatar";
import IconButton from "../utils/buttons/IconButton";

import { IBoard } from "../../models/board/types";
import BlockThumbnail from "./BlockThumnail";

export interface IBlockParentSelectionProps {
  possibleParents: Array<Pick<IBoard, "customId" | "name" | "color" | "description">>;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (parentId: string) => void;
}

const BlockParentSelection: React.FC<IBlockParentSelectionProps> = (props) => {
  const { value, possibleParents, placeholder, disabled, onChange } = props;

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
          <BlockThumbnail showName block={parent} />
        </Menu.Item>
      ))}
    </Menu>
  );

  const renderSelectedParent = () => {
    if (value) {
      const immediateParentId = value;
      const immediateParent = findBlock(possibleParents, immediateParentId);

      if (immediateParent) {
        return <BlockThumbnail showName block={immediateParent} />;
      } else {
        return <ItemAvatar />;
      }
    }

    return placeholder || "Select parent block";
  };

  const renderDropdownContent = () => {
    return (
      <div style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
        <Space size={"large"}>
          {renderSelectedParent()}
          <IconButton icon={<CaretDownOutlined />} />
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

function findBlock<T extends { customId: string }>(blocks: Array<T>, id: string) {
  return blocks.find((b) => b.customId === id);
}

export default BlockParentSelection;
