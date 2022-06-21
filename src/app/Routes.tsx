import { css } from "@emotion/css";
import { Route, Switch } from "react-router-dom";
import LoginContainer from "../components/login/LoginContainer";
import ChangePasswordWithTokenContainer from "../components/password/ChangePasswordWithTokenContainer";
import ForgotPasswordContainer from "../components/password/ForgotPasswordContainer";
import SignupContainer from "../components/signup/SignupContainer";
import WebHeader from "../web/web0/WebHeader";
import Web1 from "../web/web1/Web";

const classes = {
  componentContent: css({
    width: "100%",
    maxWidth: "400px",
    justifyContent: "center",
    margin: "auto",
    marginTop: "48px",
  }),
  componentRoot: css({ flexDirection: "column", display: "flex" }),
};

function renderComponent(component: any) {
  return () => {
    const ComponentX = component;
    return (
      <div className={classes.componentRoot}>
        <WebHeader />
        <div className={classes.componentContent}>
          <ComponentX />
        </div>
      </div>
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
      <Route exact path="/" component={Web1} />
    </Switch>
  );
}
