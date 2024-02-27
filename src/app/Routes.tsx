import { css } from "@emotion/css";
import { Route, Switch } from "react-router-dom";
import AppHome from "../components/appHome/AppHome";
import LoginContainer from "../components/login/LoginContainer";
import ChangePasswordWithTokenContainer from "../components/password/ChangePasswordWithTokenContainer";
import ForgotPasswordContainer from "../components/password/ForgotPasswordContainer";
import SignupContainer from "../components/signup/SignupContainer";
import { appRoutes } from "../models/app/routes";
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
    const ComponentNode = component;
    return (
      <div className={classes.componentRoot}>
        <WebHeader />
        <div className={classes.componentContent}>
          <ComponentNode />
        </div>
      </div>
    );
  };
}

export default function Routes() {
  return (
    <Switch>
      <Route path={appRoutes.signup} render={renderComponent(SignupContainer)} />
      <Route path={appRoutes.login} render={renderComponent(LoginContainer)} />
      <Route path={appRoutes.forgotPassword} render={renderComponent(ForgotPasswordContainer)} />
      <Route
        path={appRoutes.changePassword}
        render={renderComponent(ChangePasswordWithTokenContainer)}
      />
      <Route path={appRoutes.app} component={AppHome} />
      <Route exact path={appRoutes.home} component={Web1} />
    </Switch>
  );
}
