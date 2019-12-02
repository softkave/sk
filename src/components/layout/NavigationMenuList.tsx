import styled from "@emotion/styled";
import { Icon, Menu } from "antd";
import React from "react";

export interface INavigationMenuListProps {
  currentItemKey?: string;
  onClick: (key: string) => void;
}

const NavigationMenuList: React.FC<INavigationMenuListProps> = props => {
  const { currentItemKey, onClick } = props;

  const renderMenu = () => (
    <StyledMenu
      selectedKeys={currentItemKey ? [currentItemKey] : []}
      onClick={event => onClick(event.key)}
    >
      <Menu.Item key="notifications">
        <Icon type="mail" />
        <span>Notifications</span>
      </Menu.Item>
      <Menu.Item key="assigned-tasks">
        <Icon type="schedule" />
        <span>Assigned Tasks</span>
      </Menu.Item>
      <Menu.Item key="organizations">
        <Icon type="block" />
        <span>Organizations</span>
      </Menu.Item>
    </StyledMenu>
  );

  return renderMenu();
};

export default NavigationMenuList;

const StyledMenu = styled(Menu)({
  borderRight: "none !important"
});
