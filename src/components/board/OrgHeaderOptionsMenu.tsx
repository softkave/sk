import { EditOutlined } from "@ant-design/icons";
import { Menu, Space } from "antd";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { IAppOrganization } from "../../models/organization/types";

import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";

export enum OrgHeaderSettingsMenuKey {
  EDIT = "EDIT",
}

export interface IOrgHeaderOptionsMenuProps {
  block: IAppOrganization;
  onSelect: (key: OrgHeaderSettingsMenuKey) => void;
}

const OrgHeaderOptionsMenu: React.FC<IOrgHeaderOptionsMenuProps> = (props) => {
  const { block, onSelect } = props;

  const renderTrigger = React.useCallback(
    (renderTriggerProps: IMenuWithTriggerRenderTriggerProps) => {
      return (
        <div
          style={{
            cursor: "pointer",
            textTransform: "capitalize",
          }}
          onClick={renderTriggerProps.openMenu}
        >
          <MoreHorizontal />
        </div>
      );
    },
    []
  );

  const renderBlockOptions = React.useCallback(
    (renderMenuProps: IMenuWithTriggerRenderMenuProps) => {
      return (
        <Menu
          onClick={(event) => {
            onSelect(event.key as OrgHeaderSettingsMenuKey);
            renderMenuProps.closeMenu();
          }}
        >
          <Menu.Item
            style={{ textTransform: "capitalize" }}
            key={OrgHeaderSettingsMenuKey.EDIT}
          >
            <Space align="center" size={12}>
              <EditOutlined />
              <span>Edit {block.type}</span>
            </Space>
          </Menu.Item>
        </Menu>
      );
    },
    [block, onSelect]
  );

  return (
    <MenuWithTrigger
      menuType="dropdown"
      renderTrigger={renderTrigger}
      renderMenu={renderBlockOptions}
      // dropdownPlacement="bottomRight"
    />
  );
};

export default OrgHeaderOptionsMenu;
