import React from "react";
import { Input } from "antd";

const ACFMessage = React.memo(function ACFMessage(props) {
  const { value, onChange } = props;

  return (
    <Input.TextArea
      autosize
      autoComplete="off"
      value={value}
      onChange={event => {
        onChange(event.target.value);
      }}
    />
  );
});

export default ACFMessage;
