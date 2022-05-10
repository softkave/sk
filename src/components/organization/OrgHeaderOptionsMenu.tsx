import { EditOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { getBlockTypeLabel } from "../../models/block/block";
import { IAppOrganization } from "../../models/organization/types";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "../board/MenuWithTrigger";
import appTheme from "../theme";

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
          style={{ width: appTheme.dimensions.menuWidth }}
        >
          <Menu.Item
            style={{ textTransform: "capitalize" }}
            key={OrgHeaderSettingsMenuKey.EDIT}
            icon={<EditOutlined />}
          >
            <span>Edit {getBlockTypeLabel(block.type)}</span>
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
