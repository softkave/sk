import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Web from "./Web.jsx";
import AppMenu from "./components/app-menu/AppMenu.jsx";
import RootGroupContainer from "./components/group/RootGroup.jsx";
import OrgsContainer from "./components/org/OrgsContainer.jsx";
import NotificationsContainer from "./components/notification/NotificationsContainer.jsx";
import Signup from "./components/signup/Signup.jsx";
import Login from "./components/login/Login.jsx";
import ForgotPassword from "./components/password/ForgotPassword.jsx";
import ChangePasswordWithToken from "./components/password/ChangePasswordWithToken.jsx";
import { Col, Row } from "antd";
import { connect } from "react-redux";

function MainApp() {
  return (
    <AppMenu
      currentItemKey="notifications"
      menuItems={[
        {
          key: "notifications",
          label: "Notifications",
          component: NotificationsContainer
        },
        {
          key: "personal",
          label: "Personal",
          component: RootGroupContainer
        },
        {
          key: "orgs",
          label: "Orgs",
          component: OrgsContainer
        }
      ]}
    />
  );
}

function renderComponent(component) {
  return function() {
    const ComponentX = component;
    return (
      <Row type="flex" justify="center">
        <Col sm={24} md={8}>
          <ComponentX />
        </Col>
      </Row>
    );
  };
}

function App(props) {
  let redirectHere = null;
  if (props.userIsLoggedIn) {
    if (window.location.pathname.indexOf("app") === -1) {
      redirectHere = "/app";
    }
  } else if (window.location.pathname.indexOf("app")) {
    redirectHere = "/";
  }

  console.log(props, redirectHere);

  return (
    <div style={{ height: "100%" }}>
      {redirectHere && <Redirect to={redirectHere} exact />}
      <Switch>
        <Route path="/signup" render={renderComponent(Signup)} />
        <Route path="/login" component={renderComponent(Login)} />
        <Route
          path="/forgot-password"
          component={renderComponent(ForgotPassword)}
        />
        <Route
          path="/change-password"
          component={renderComponent(ChangePasswordWithToken)}
        />
        <Route path="/app" component={MainApp} />
        <Route path="/" exact component={Web} />
      </Switch>
    </div>
  );
}

function mapStateToProps(state) {
  console.log(state);
  return {
    userIsLoggedIn: state.user && !!state.user.token
  };
}

export default connect(mapStateToProps)(App);
