import { Col, Row } from "antd";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IUser } from "../../models/user/user";
import { notificationsViewName } from "../../redux/view/notifications";
import { orgsViewName } from "../../redux/view/orgs";
import SelectOrgContainer from "../select-org/SelectOrgContainer";
import Header from "./Header";

export interface IAppHeaderProps extends RouteComponentProps {
  user: IUser;
  currentViewName: string;
  onLogout: () => void;
  onChangeView: (newViewName: string) => void;
}

class AppHeader extends React.Component<IAppHeaderProps> {
  public render() {
    const { onLogout, user, onChangeView, currentViewName } = this.props;

    return (
      <Header
        user={user}
        currentItemKey={currentViewName}
        menuItems={[
          {
            key: notificationsViewName,
            label: "Notifications"
          },
          {
            key: orgsViewName,
            label: "Orgs"
          }
        ]}
        onSelectMenu={(viewName: string) => onChangeView(viewName)}
        onLogout={onLogout}
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

export default withRouter(AppHeader);
