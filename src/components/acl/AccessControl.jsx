import React from "react";
import Acl from "./Acl.jsx";
import Roles from "../role/Roles.jsx";

export default class AccessControl extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.acl !== this.props.acl ||
      nextProps.roles !== this.props.roles
    ) {
      return true;
    }

    return false;
  }

  render() {
    return null;
  }
}
