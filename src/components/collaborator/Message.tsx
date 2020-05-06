import { Input } from "antd";
import React from "react";

export interface IMessageProps {
  onChange: (value: string) => void;

  disabled?: boolean;
  value?: string;
  placeholder?: string;
  onBlur?: () => void;
}

class Message extends React.PureComponent<IMessageProps> {
  public render() {
    const { value, onChange, onBlur, placeholder, disabled } = this.props;

    return (
      <Input.TextArea
        placeholder={placeholder}
        autoSize={{ minRows: 2, maxRows: 6 }}
        autoComplete="off"
        value={value}
        onBlur={onBlur}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        disabled={disabled}
      />
    );
  }
}

export default Message;
