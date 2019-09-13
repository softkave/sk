import { DatePicker } from "antd";
import moment from "moment";
import React from "react";

export interface IACFExpiresAtProps {
  onChange: (value?: number) => void;
  minDate: moment.Moment;
  value?: number;
  placeholder?: string;
  dateFormat?: string;
}

class ACFExpiresAt extends React.PureComponent<IACFExpiresAtProps> {
  public static defaultProps = {
    dateFormat: "MMM DD, YYYY"
  };

  public render() {
    const { value, onChange, dateFormat, minDate, placeholder } = this.props;

    return (
      <DatePicker
        placeholder={placeholder}
        format={dateFormat}
        value={value ? moment(value) : undefined}
        disabledDate={current => {
          return !!(current && current < minDate);
        }}
        onChange={date => {
          onChange(date ? date.valueOf() : undefined);
        }}
      />
    );
  }
}

export default ACFExpiresAt;
