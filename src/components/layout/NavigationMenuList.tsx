import styled from "@emotion/styled";
import { Icon, Menu } from "antd";
import React from "react";
import StyledFlexColumnContainer from "../styled/ColumnContainer";
import StyledFlexFillContainer from "../styled/FillContainer";

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

export const getBaseNavPath = (path?: string) => {
  if (path) {
    return `/${appPath}${path[0] !== pathSeparator ? "/" : ""}${path}`;
  }

  return `/${appPath}`;
};

export const getFullBaseNavPath = () => {
  return getBaseNavPath(getCurrentBaseNavPath());
};

export interface INavigationMenuListProps {
  currentItemKey?: string;
  onClick: (key: string) => void;
}

const NavigationMenuList: React.SFC<INavigationMenuListProps> = props => {
  const { currentItemKey, onClick } = props;

  const renderMenuWithContainer = () => (
    <StyledFlexFillContainer>
      <StyledMenu
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
      </StyledMenu>
    </StyledFlexFillContainer>
  );

  return (
    <StyledFlexFillContainer>
      <StyledFlexColumnContainer>
        {renderMenuWithContainer()}
        <StyledFooter>
          &copy; Abayomi Akintomide {new Date().getFullYear()}
        </StyledFooter>
      </StyledFlexColumnContainer>
    </StyledFlexFillContainer>
  );
};

export default NavigationMenuList;

const StyledMenu = styled(Menu)({
  borderRight: "none !important"
});

const StyledFooter = styled.footer({
  margin: "16px"
});
