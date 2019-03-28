import React from "react";
import { Switch } from "antd";

export default class BitSwitch extends React.Component {
  static defaultProps = {
    options: ["No", "Yes"]
  };

  render() {
    const { onChange, disabled, options, defaultValue } = this.props;
    let value =
      this.props.value !== undefined ? this.props.value : defaultValue;
    let option1Style = {
      marginRight: "8px",
      fontWeight: !value ? "bold" : "500"
    };

    let option2Style = {
      marginLeft: "8px",
      fontWeight: value ? "bold" : "500"
    };

    return (
      <span>
        <span style={option1Style}>{options[0]}</span>
        <Switch checked={!!value} onChange={onChange} disabled={disabled} />
        <span style={option2Style}>{options[1]}</span>
      </span>
    );
  }
}
