import React from "react";
import { DatePicker } from "antd";
import moment from "moment";

class ACFExpiresAt extends React.PureComponent {
  static defaultProps = {
    dateFormat: "MMM DD, YYYY"
  };

  render() {
    const { value, onChange, dateFormat, minDate } = this.props;

    return (
      <DatePicker
        format={dateFormat}
        value={value && moment(value, dateFormat)}
        disabledDate={current => {
          return current && current < minDate;
        }}
        onChange={date => {
          onChange(date);
        }}
      />
    );
  }
}

export default ACFExpiresAt;
