import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginContainer from "../components/login/LoginContainer";
import ChangePasswordWithTokenContainer from "../components/password/ChangePasswordWithTokenContainer";
import ForgotPasswordContainer from "../components/password/ForgotPasswordContainer";
import SignupContainer from "../components/signup/SignupContainer";
import StyledContainer from "../components/styled/Container";
import Web from "../web/Web";
import WebHeader from "../web/WebHeader";
// import MainLayout from "../components/layout/MainLayout";

function renderComponent(component) {
  return () => {
    const ComponentX = component;
    return (
      <StyledContainer s={{ flexDirection: "column" }}>
        <WebHeader />
        <StyledContainer
          s={{
            width: "100%",
            maxWidth: "400px",
            justifyContent: "center",
            margin: "auto"
          }}
        >
          <ComponentX />
        </StyledContainer>
      </StyledContainer>
    );
  };
}

export default function Routes() {
  return (
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
      {/* <Route path="/app" component={MainLayout} /> */}
      <Route exact path="/" component={Web} />
    </Switch>
  );
}
