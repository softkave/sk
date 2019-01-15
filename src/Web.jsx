import React from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import "./web.css";

function Web(props) {
  const { user } = props;
  if (user) {
    return <Redirect to="/app" />;
  }

  return (
    <div className="web">
      <Link to="/signup">Signup</Link>
      <Link to="/login">Login</Link>
      <Link to="/forgot-password">Forgot Password</Link>
      <Link to="/change-password">Change Password</Link>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Web);
