import React from "react";
import { Switch, Route } from "react-router-dom";
import Web from "./Web.jsx";
import SignupContainer from "./components/account/signup/SignupContainer.jsx";
import LoginContainer from "./components/account/login/LoginContainer.jsx";
import ForgotPasswordContainer from "./components/account/password/ForgotPasswordContainer.jsx";
import ChangePasswordWithTokenContainer from "./components/account/password/ChangePasswordWithTokenContainer.jsx";
import App from "./app";
import { Col, Row } from "antd";

function renderComponent(component) {
  return function() {
    const ComponentX = component;
    return (
      <Row type="flex" justify="center">
        <Col sm={24} md={12} lg={8} style={{ padding: "1em" }}>
          <ComponentX />
        </Col>
      </Row>
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
