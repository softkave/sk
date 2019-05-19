import React from "react";
import { getWindowWidth } from "../../utils/window";
import { Menu, Drawer, Icon, Button, Row, Col } from "antd";
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
          <Menu
            defaultSelectedKeys={[currentItemKey]}
            onClick={this.onSelectMenu}
            style={{ marginTop: "2em" }}
          >
            {menuItems.map(item => (
              <MenuItem key={item.key}>
                {item.icon && <Icon type={item.icon} theme={item.iconTheme} />}
                <span>{item.label}</span>
              </MenuItem>
            ))}
          </Menu>
        </Drawer>
        <div className="app-header">
          <Row>
            <Col span={4}>
              <Button
                icon={collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.onToggleMenu}
              />
            </Col>
            <Col span={16}>{children}</Col>
            <Col span={4} style={{ textAlign: "right" }}>
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
