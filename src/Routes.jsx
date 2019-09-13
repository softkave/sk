import React from "react";
import { Switch, Route } from "react-router-dom";
import { Col, Row } from "antd";

import Web from "./web/Web";
import SignupContainer from "./components/account/signup/SignupContainer";
import LoginContainer from "./components/account/login/LoginContainer";
import ForgotPasswordContainer from "./components/account/password/ForgotPasswordContainer";
import ChangePasswordWithTokenContainer from "./components/account/password/ChangePasswordWithTokenContainer";
import App from "./app";
import WebHeader from "./web/WebHeader";

function renderComponent(component) {
  return function() {
    const ComponentX = component;
    return (
      <div>
        <WebHeader />
        <Row type="flex" justify="center">
          <Col sm={24} md={12} lg={8} style={{ padding: "1em" }}>
            <ComponentX />
          </Col>
        </Row>
      </div>
    );
  };
}

export default function Routes() {
  return (
    <div style={{ height: "100%" }}>
      <Switch>
        <Route path="/signup" render={renderComponent(SignupContainer)} />
        <Route path="/login" render={renderComponent(LoginContainer)} />
        <Route
          path="/forgot-password"
          render={renderComponent(ForgotPasswordContainer)}
        />
        <Route
          path="/change-password"
          render={renderComponent(ChangePasswordWithTokenContainer)}
        />
        <Route path="/app" component={App} />
        <Route path="/" exact component={Web} />
      </Switch>
    </div>
  );
}
