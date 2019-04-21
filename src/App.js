import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Web from "./Web.jsx";
import AppMenu from "./components/app-menu/AppMenu.jsx";
import RootGroupContainer from "./components/group/RootGroupContainer.jsx";
import OrgsContainer from "./components/org/OrgsContainer.jsx";
import NotificationsContainer from "./components/notification/NotificationsContainer.jsx";
import SignupContainer from "./components/signup/SignupContainer.jsx";
import LoginContainer from "./components/login/LoginContainer.jsx";
import ForgotPasswordContainer from "./components/password/ForgotPsContainer.jsx";
import ChangePasswordWithTokenContainer from "./components/password/ChangePsWithTokenContainer.jsx";
import { Col, Row, notification } from "antd";
import { connect } from "react-redux";
import { mergeDataByPath, clearState } from "./redux/actions/data";
import netInterface from "./net/index";

function MainApp(props) {
  const { onLogout } = props;

  return (
    <AppMenu
      currentItemKey="orgs"
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
        },
        {
          key: "logout",
          label: "Logout",
          component: null
        }
      ]}
      onSelectMenu={key => {
        if (key === "logout" && onLogout) {
          onLogout();
        }
      }}
    />
  );
}

function mainAppMapStateToProps(state, props) {
  return {
    ...props
  };
}

function mainAppMapDispatchToProps(dispatch) {
  return {
    onLogout() {
      dispatch(clearState());
      netInterface("user.logout");
    }
  };
}

const MainAppContainer = connect(
  mainAppMapStateToProps,
  mainAppMapDispatchToProps
)(MainApp);

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
    notification.error({
      title: "Error",
      message: "An error ocurred"
    });

    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }

  route() {
    const { userIsLoggedIn, history, getSavedUserData } = this.props;

    if (userIsLoggedIn) {
      if (window.location.pathname.indexOf("app") === -1) {
        history.push("/app");
        return false;
      }
    } else {
      if (window.location.pathname.indexOf("app") > -1) {
        getSavedUserData();
        history.push("/");
        return true;
      }
    }
  }

  render() {
    if (this.state.skipRender) {
      return null;
    }

    return (
      <div style={{ height: "100%" }} className="app">
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
          <Route path="/app" component={MainAppContainer} />
          <Route path="/" exact component={Web} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    ...props,
    userIsLoggedIn: state.user && !!state.user.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    async getSavedUserData() {
      let result = await netInterface("user.getSavedUserData");

      if (result) {
        dispatch(mergeDataByPath("user", result));
      }
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
