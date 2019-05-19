import React from "react";
import { Dropdown, Menu, Avatar } from "antd";
import { withRouter } from "react-router-dom";
import Header from "../components/header/Header";
import Personal from "./personal";
import Orgs from "./orgs";
import Notifications from "./notification";

const defaultAvatarColor = "#aaa";

class App extends React.Component {
  componentDidMount() {
    const { history, loginValid } = this.props;

    if (!loginValid) {
      history.push("/");
    }
  }

  componentDidUpdate() {
    const { history, loginValid } = this.props;

    if (!loginValid) {
      history.push("/");
    }
  }

  onSelectAvatarMenu = event => {
    if (event.key === "logout") {
      this.props.onLogout();
    }
  };

  render() {
    const { onLogout, loginValid, user } = this.props;

    if (!loginValid) {
      return null;
    }

    return (
      <Header
        currentItemKey="orgs"
        menuItems={[
          {
            key: "notifications",
            label: "Notifications",
            component: Notifications
          },
          {
            key: "personal",
            label: "Personal",
            component: Personal
          },
          {
            key: "orgs",
            label: "Orgs",
            component: Orgs
          },
          {
            key: "logout",
            label: "Logout",
            component: null
          }
        ]}
        onSelectMenu={key => {
          if (key === "logout" && onLogout) {
            onLogout();
          }
        }}
        avatar={
          <Dropdown
            overlay={
              <Menu
                onClick={this.onSelectAvatarMenu}
                style={{ minWidth: "120px" }}
              >
                <Menu.Item key="logout">Logout</Menu.Item>
                {/* <Menu.Item key="settings">Settings</Menu.Item> */}
              </Menu>
            }
            trigger={["click"]}
          >
            <Avatar
              size="default"
              shape="square"
              style={{
                backgroundColor: user.color || defaultAvatarColor,
                cursor: "pointer"
              }}
            />
          </Dropdown>
        }
      />
    );
  }
}

export default withRouter(App);
