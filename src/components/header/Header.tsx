import styled from "@emotion/styled";
import { Button, Col, Drawer, Dropdown, Icon, Menu, Row } from "antd";
import React from "react";

import { IUser } from "../../models/user/user";
import { getWindowWidth } from "../../utils/window";
import ItemAvatar from "../ItemAvatar";

import "./header.css";

const MenuItem = Menu.Item;
const defaultAvatarColor = "#aaa";

export interface IHeaderProps {
  menuItems: Array<{
    key: string;
    label: string;
    iconTheme?: "filled" | "outlined" | "twoTone";
    icon?: string;
  }>;
  user: IUser;
  onSelectMenu: (key: string) => void;
  onLogout: () => void;
  collapsed?: boolean;
  currentItemKey?: string;
}

interface IHeaderState {
  collapsed: boolean;
}

class Header extends React.Component<IHeaderProps, IHeaderState> {
  public static defaultProps = {
    collapsed: true
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed
    };
  }

  public render() {
    const { menuItems, children, user, currentItemKey } = this.props;
    const { collapsed } = this.state;
    const windowWidth = getWindowWidth();
    const menuDrawerWidth = windowWidth / (windowWidth < 300 ? 1 : 2);

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Drawer
          width={menuDrawerWidth}
          onClose={this.onToggleMenu}
          visible={!collapsed}
          placement="left"
        >
          <DrawerBody>
            <Menu
              defaultSelectedKeys={currentItemKey ? [currentItemKey] : []}
              onClick={this.onSelectMenu}
              style={{ marginTop: "2em" }}
            >
              {menuItems.map(item => (
                <MenuItem key={item.key}>
                  {item.icon && (
                    <Icon
                      type={item.icon}
                      theme={item.iconTheme ? item.iconTheme : "filled"}
                    />
                  )}
                  <span>{item.label}</span>
                </MenuItem>
              ))}
              <Menu.Divider />
              <MenuItem key="logout">Logout</MenuItem>
            </Menu>
          </DrawerBody>
        </Drawer>
        <div className="app-header">
          <Row>
            <Col span={3}>
              <Button icon={"menu"} onClick={this.onToggleMenu} />
            </Col>
            <Col span={18}>{children}</Col>
            <Col span={3} style={{ textAlign: "right" }}>
              <Dropdown
                overlay={
                  <Menu
                    onClick={this.onSelectAvatarMenu}
                    style={{ minWidth: "120px" }}
                  >
                    <Menu.Item key="logout">Logout</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <ItemAvatar
                  clickable
                  onClick={() => null}
                  color={user.color || defaultAvatarColor}
                />
              </Dropdown>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  private onToggleMenu = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  };

  private onSelectMenu = event => {
    const { onSelectMenu, onLogout } = this.props;

    this.setState(
      {
        collapsed: true
      },
      () => {
        if (event.key === "logout") {
          onLogout();
        } else {
          onSelectMenu(event.key);
        }
      }
    );
  };

  private onSelectAvatarMenu = event => {
    if (event.key === "logout") {
      this.props.onLogout();
    }
  };
}

export default Header;

const DrawerBody = styled("div")({
  padding: "24px",

  "& .ant-menu-vertical": {
    borderRight: "0 !important"
  }
});
