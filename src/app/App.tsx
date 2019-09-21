import { Col, Dropdown, Menu, Row } from "antd";
import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import Header from "../components/header/Header";
import SelectOrgContainer from "../components/select-org/SelectOrgContainer";
import StyledAvatar from "../components/StyledAvatar";
import { IUser } from "../models/user/user";
import Notifications from "./notification";
import Orgs from "./orgs";

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
          // TODO: There is inconsistency when clicking the logout botton, it works only after the second try
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
            <StyledAvatar
              clickable
              onClick={() => null}
              color={user.color || defaultAvatarColor}
            />
          </Dropdown>
        }
      >
        <Row type="flex" align="middle" justify="center">
          <Col span={24}>
            <SelectOrgContainer />
          </Col>
        </Row>
      </Header>
    );
  }
}

export default withRouter(App);
