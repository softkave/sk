import React from "react";
//import throttle from "lodash/throttle";
import { getWindowWidth } from "../../utils/window";
import { Menu, Drawer, Icon, Button } from "antd";
import "./app-menu.css";

const MenuItem = Menu.Item;
const appMenuDefaultProps = {
  collapsed: true
};

class AppMenu extends React.Component {
  constructor(props) {
    super(props);
    /*this.updateWindowData();
    this.updateWindowData = throttle(this.updateWindowData, 100, {
      leading: true
    });*/

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

  /*componentDidMount() {
    window.addEventListener("resize", this.updateWindowData);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowData);
  }

  updateWindowData() {
    const { windowType, updateWindowData } = this.props;
    const tempWindowType = this.getWindowTypeFromWindow();
    if (!windowType || windowType !== tempWindowType) {
      updateWindowData({ windowType: tempWindowType });
    }
  }

  getWindowTypeFromWindow() {
    const { maxMobileWidth } = this.props;
    if (getWindowWidth() > maxMobileWidth) {
      return "desktop";
    }

    return "mobile";
  }*/

  render() {
    const { menuItems } = this.props;
    const { currentItemKey, collapsed } = this.state;
    const currentItem = menuItems.find(item => item.key === currentItemKey);
    const CurrentComponent = currentItem.component;
    const windowWidth = getWindowWidth();
    let menuDrawerWidth = windowWidth / (windowWidth < 300 ? 1 : 2);
    // menuDrawerWidth = menuDrawerWidth < 300 ? windowWidth : menuDrawerWidth;

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
        <div className="app-menu-header">
          <Button
            icon={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={this.onToggleMenu}
          />
        </div>
        <div className="app-menu-content">
          {CurrentComponent && <CurrentComponent {...currentItem.props} />}
        </div>
      </div>
    );
  }
}

AppMenu.defaultProps = appMenuDefaultProps;

export default AppMenu;
