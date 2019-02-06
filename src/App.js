import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Web from "./Web.jsx";
import AppMenu from "./components/app-menu/AppMenu.jsx";
import RootGroupContainer from "./components/group/RootGroupContainer.jsx";
import OrgsContainer from "./components/org/OrgsContainer.jsx";
import NotificationsContainer from "./components/notification/NotificationsContainer.jsx";
import Signup from "./components/signup/Signup.jsx";
import Login from "./components/login/Login.jsx";
import ForgotPassword from "./components/password/ForgotPassword.jsx";
import ChangePasswordWithToken from "./components/password/ChangePasswordWithToken.jsx";
import { Col, Row, notification } from "antd";
import { connect } from "react-redux";

function MainApp() {
  return (
    <AppMenu
      currentItemKey="personal"
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skipRender: this.route()
    };
  }

  componentDidMount() {
    let skipRender = this.route();
    if (this.state.skipRender !== skipRender) {
      this.setState({ skipRender });
    }
  }

  componentDidUpdate() {
    let skipRender = this.route();
    if (this.state.skipRender !== skipRender) {
      this.setState({ skipRender });
    }
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV === "development") {
      this.props.saveState();
      throw error;
    } else {
      notification.error({
        title: "Error",
        description: "An error ocurred",
        duration: null
      });
    }
  }

  route() {
    const { userIsLoggedIn, history } = this.props;
    if (userIsLoggedIn) {
      if (window.location.pathname.indexOf("app") === -1) {
        history.push("/app");
        return true;
      }
    } else if (window.location.pathname.indexOf("app") > -1) {
      history.push("/");
      return true;
    }
  }

  render() {
    if (this.state.skipRender) {
      return null;
    }

    return (
      <div style={{ height: "100%" }}>
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
}

function mapStateToProps(state) {
  console.log(state);
  return {
    userIsLoggedIn: state.user && !!state.user.token,
    saveState() {
      sessionStorage.setItem("store", JSON.stringify(state));
    }
  };
}

export default withRouter(connect(mapStateToProps)(App));
