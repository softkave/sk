import { Input } from "antd";
import React from "react";

export interface IACFMessageProps {
  onChange: (value: string) => void;
  value?: string;
  onBlur?: () => void;
}

class ACFMessage extends React.PureComponent<IACFMessageProps> {
  public render() {
    const { value, onChange, onBlur } = this.props;

    return (
      <Input.TextArea
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

export default ACFMessage;
