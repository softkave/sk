import { DatePicker } from "antd";
import moment from "moment";
import React from "react";

export interface IExpiresAtProps {
  onChange: (value?: number) => void;
  minDate: moment.Moment;

  disabled?: boolean;
  value?: number;
  placeholder?: string;
  dateFormat?: string;
  style?: React.CSSProperties;
}

class ExpiresAt extends React.PureComponent<IExpiresAtProps> {
  public static defaultProps = {
    dateFormat: "MMM DD, YYYY",
  };

  public render() {
    const {
      value,
      onChange,
      dateFormat,
      minDate,
      placeholder,
      disabled,
      style,
    } = this.props;

    return (
      <DatePicker
        placeholder={placeholder}
        format={dateFormat}
        value={value ? moment(value) : undefined}
        disabledDate={(current) => {
          return !!(current && current < minDate);
        }}
        onChange={(date) => {
          onChange(date ? date.valueOf() : undefined);
        }}
        disabled={disabled}
        style={style}
      />
    );
  }
}

export default ExpiresAt;
