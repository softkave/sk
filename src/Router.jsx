import React from "react";
import { withRouter } from "react-router-dom";
import { Spin } from "antd";
import { connect } from "react-redux";
import { mergeDataByPath, clearState } from "./redux/actions/data";
import netInterface from "./net/index";
import Routes from "./Routes";

class App extends React.Component {
  state = {
    ready: false,
    error: null
  };

  async componentDidMount() {
    const { user, saveUserData, history, logOut } = this.props;

    if (!!!user) {
      try {
        let result = await netInterface("user.getSavedUserData");

        if (result && result.token) {
          saveUserData(result);
          this.setState({ ready: true }, () => {
            history.push("/app");
          });
        } else {
          this.setState({ ready: true });
        }
      } catch (error) {
        logOut();
        this.setState({ ready: true });
        // this.setState({ error });
      }
    } else {
      if (!window.location.pathname.includes("app")) {
        history.push("/app");
      }
    }
  }

  componentDidUpdate() {
    const { user, history } = this.props;

    if (user) {
      if (!window.location.pathname.includes("app")) {
        history.push("/app");
      }
    }
  }

  componentDidCatch(error) {
    this.setState({ error, ready: false });
  }

  render() {
    const { ready, error } = this.state;

    if (error) {
      return (
        <div
          style={{
            height: "100%",
            padding: "2em",
            color: "red",
            fontWeight: "bold"
          }}
        >
          An error occurred.
        </div>
      );
    } else if (ready) {
      return <Routes />;
    } else {
      return (
        <Spin spinning={true} style={{ height: "100%" }}>
          <div style={{ height: "100%" }} />
        </Spin>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveUserData(user) {
      dispatch(mergeDataByPath("user", user));
    },

    logOut() {
      dispatch(clearState());
      netInterface("user.logout");
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
