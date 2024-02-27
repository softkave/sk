import { Menu } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import React from "react";
import { FiEdit3, FiMoreHorizontal, FiUnlock } from "react-icons/fi";
import { IAppWorkspace } from "../../models/organization/types";
import MenuWithTrigger, {
  IMenuWithTriggerRenderMenuProps,
  IMenuWithTriggerRenderTriggerProps,
} from "../board/MenuWithTrigger";
import appTheme from "../theme";
import CustomIcon from "../utils/buttons/CustomIcon";
import IconButton from "../utils/buttons/IconButton";

export enum OrgHeaderSettingsMenuKey {
  EDIT = "EDIT",
  AssignPermission = "AssignPermission",
}

export interface IOrgHeaderOptionsMenuProps {
  organization: IAppWorkspace;
  onSelect: (key: OrgHeaderSettingsMenuKey) => void;
}

const OrganizationHeaderOptionsMenu: React.FC<IOrgHeaderOptionsMenuProps> = (props) => {
  const { onSelect } = props;
  const renderTrigger = (renderTriggerProps: IMenuWithTriggerRenderTriggerProps) => {
    return (
      <IconButton
        icon={<CustomIcon icon={<FiMoreHorizontal />} />}
        onClick={renderTriggerProps.openMenu}
      />
    );
  };

  // TODO: auth checks
  const canUpdateOrganization = true;
  const canAssignPermission = true;

  const renderOptions = (renderMenuProps: IMenuWithTriggerRenderMenuProps) => {
    const items: MenuItemType[] = [];
    if (canUpdateOrganization) {
      items.push({
        label: "Edit Organization",
        key: OrgHeaderSettingsMenuKey.EDIT,
        icon: <CustomIcon icon={<FiEdit3 />} />,
        style: { textTransform: "capitalize" },
      });
    }
    if (canAssignPermission) {
      items.push({
        label: "Assign Permission",
        key: OrgHeaderSettingsMenuKey.AssignPermission,
        icon: <CustomIcon icon={<FiUnlock />} />,
        style: { textTransform: "capitalize" },
      });
    }
    return (
      <Menu
        onClick={(event) => {
          onSelect(event.key as OrgHeaderSettingsMenuKey);
          renderMenuProps.closeMenu();
        }}
        style={{ width: appTheme.dimensions.menuWidth }}
        items={items}
      />
    );
  };

  return (
    <MenuWithTrigger
      menuType="dropdown"
      renderTrigger={renderTrigger}
      renderMenu={renderOptions}
      // dropdownPlacement="bottomRight"
    />
  );
};

export default OrganizationHeaderOptionsMenu;
