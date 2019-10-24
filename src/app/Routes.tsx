import { Col, Row } from "antd";
import React from "react";
import { Route, Switch } from "react-router-dom";

import LoginContainer from "../components/login/LoginContainer";
import ChangePasswordWithTokenContainer from "../components/password/ChangePasswordWithTokenContainer";
import ForgotPasswordContainer from "../components/password/ForgotPasswordContainer";
import SignupContainer from "../components/signup/SignupContainer";
import Web from "../web/Web";
import WebHeader from "../web/WebHeader";

function renderComponent(component) {
  return () => {
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
        <Route path="/" exact component={Web} />
      </Switch>
    </div>
  );
}
