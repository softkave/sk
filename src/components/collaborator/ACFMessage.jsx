import React from "react";
import { Input } from "antd";

class ACFMessage extends React.PureComponent {
  render() {
    const { value, onChange } = this.props;

    return (
      <Input.TextArea
        autosize={{ minRows: 2, maxRows: 6 }}
        autoComplete="off"
        value={value}
        onChange={event => {
          onChange(event.target.value);
        }}
      />
    );
  }
}

export default ACFMessage;
