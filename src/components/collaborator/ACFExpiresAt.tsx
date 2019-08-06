import { DatePicker } from "antd";
import moment from "moment";
import React from "react";

export interface IACFExpiresAtProps {
  onChange: (value: number) => void;
  minDate: moment.Moment;
  value?: number;
  dateFormat?: string;
}

class ACFExpiresAt extends React.PureComponent<IACFExpiresAtProps> {
  public static defaultProps = {
    dateFormat: "MMM DD, YYYY"
  };

  public render() {
    const { value, onChange, dateFormat, minDate } = this.props;

    return (
      <DatePicker
        format={dateFormat}
        value={value ? moment(value, dateFormat) : undefined}
        disabledDate={current => {
          return !!(current && current < minDate);
        }}
        onChange={date => {
          onChange(date.valueOf());
        }}
      />
    );
  }
}

export default ACFExpiresAt;
