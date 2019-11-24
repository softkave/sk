import { Icon, Menu } from "antd";
import React from "react";
import StyledCenterContainer from "../styled/CenterContainer";

const appPath = "app";
const pathSeparator = "/";

export const getCurrentBaseNavPath = () => {
  const path = window.location.pathname;
  const pathArray = path.split(pathSeparator);
  const appPathIndex = pathArray.indexOf(appPath);
  const baseNavigationPathIndex = appPathIndex + 1;

  if (appPathIndex !== -1) {
    if (pathArray.length > baseNavigationPathIndex) {
      return pathArray[baseNavigationPathIndex];
    }
  }
};

export const getBaseNavPath = (path: string) => {
  return `/${appPath}${path[0] !== pathSeparator ? "/" : ""}${path}`;
};

export interface INavigationMenuListProps {
  currentItemKey?: string;
  onClick: (key: string) => void;
}

const NavigationMenuList: React.SFC<INavigationMenuListProps> = props => {
  const { currentItemKey, onClick } = props;

  return (
    <StyledCenterContainer>
      <Menu
        selectedKeys={currentItemKey ? [currentItemKey] : []}
        onClick={event => onClick(event.key)}
      >
        <Menu.Item key="notifications">
          <Icon type="notification" />
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
      </Menu>
      <p>&copy; Abayomi Akintomide {new Date().getFullYear()}</p>
    </StyledCenterContainer>
  );
};

export default NavigationMenuList;
