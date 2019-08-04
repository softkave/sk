import { Avatar, Dropdown, Menu } from "antd";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import Header from "../components/header/Header";
import { IUser } from "../models/user/user";
import Notifications from "./notification";
import Orgs from "./orgs";
import Personal from "./personal";

const defaultAvatarColor = "#aaa";

export interface IAppProps extends RouteComponentProps {
  loginValid: boolean;
  user: IUser;
  onLogout: () => void;
}

class App extends React.Component<IAppProps> {
  public componentDidMount() {
    const { history, loginValid } = this.props;

    if (!loginValid) {
      history.push("/");
    }
  }

  public componentDidUpdate() {
    const { history, loginValid } = this.props;

    if (!loginValid) {
      history.push("/");
    }
  }

  public onSelectAvatarMenu = event => {
    if (event.key === "logout") {
      this.props.onLogout();
    }
  };

  public render() {
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
