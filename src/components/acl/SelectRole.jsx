import React from "react";
import { Select } from "antd";

export default function(props) {
  const { value, roles, onChange } = props;

  return (
    <Select value={value} onChange={onChange}>
      {roles.map(role => {
        return (
          <Select.Option key={value} value={role.level}>
            {role.label}
          </Select.Option>
        );
      })}
    </Select>
  );
}
