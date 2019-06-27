import React from "react";
import { DatePicker } from "antd";
import moment from "moment";

const ACFExpiresAt = React.memo(function ACFExpiresAt(props) {
  const { value, onChange, dateFormat, minDate } = props;

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
});

ACFExpiresAt.defaultProps = {
  dateFormat: "MMM DD, YYYY"
};

export default ACFExpiresAt;
