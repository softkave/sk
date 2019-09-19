import React from "react";
import styled from "@emotion/styled";
import { Menu, Drawer, Icon, Button, Row, Col } from "antd";

import { getWindowWidth } from "../../utils/window";
import "./header.css";

const MenuItem = Menu.Item;
const headerDefaultProps = {
  collapsed: true
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed,
      currentItemKey: props.currentItemKey
    };
  }

  onToggleMenu = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  };

  onSelectMenu = event => {
    const { onSelectMenu } = this.props;

    this.setState(
      {
        currentItemKey: event.key,
        collapsed: true
      },
      () => {
        if (onSelectMenu) {
          onSelectMenu(event.key);
        }
      }
    );
  };

  render() {
    const { menuItems, children, avatar } = this.props;
    const { currentItemKey, collapsed } = this.state;
    const currentItem = menuItems.find(item => item.key === currentItemKey);
    const CurrentComponent = currentItem.component;
    const windowWidth = getWindowWidth();
    let menuDrawerWidth = windowWidth / (windowWidth < 300 ? 1 : 2);

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
              defaultSelectedKeys={[currentItemKey]}
              onClick={this.onSelectMenu}
              style={{ marginTop: "2em" }}
            >
              {menuItems.map(item => (
                <MenuItem key={item.key}>
                  {item.icon && (
                    <Icon type={item.icon} theme={item.iconTheme} />
                  )}
                  <span>{item.label}</span>
                </MenuItem>
              ))}
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
              {avatar}
            </Col>
          </Row>
        </div>
        <div className="app-content">
          {CurrentComponent && <CurrentComponent {...currentItem.props} />}
        </div>
      </div>
    );
  }
}

Header.defaultProps = headerDefaultProps;

export default Header;

const DrawerBody = styled("div")({
  padding: "24px",

  "& .ant-menu-vertical": {
    borderRight: "0 !important"
  }
});
