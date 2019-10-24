import { Input } from "antd";
import React from "react";

export interface IMessageProps {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  onBlur?: () => void;
}

class Message extends React.PureComponent<IMessageProps> {
  public render() {
    const { value, onChange, onBlur, placeholder } = this.props;

    return (
      <Input.TextArea
        placeholder={placeholder}
        autosize={{ minRows: 2, maxRows: 6 }}
        autoComplete="off"
        value={value}
        onBlur={onBlur}
        onChange={event => {
          onChange(event.target.value);
        }}
      />
    );
  }
}

export default Message;
