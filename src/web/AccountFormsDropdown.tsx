import styled from "@emotion/styled";
import { Dropdown, Menu } from "antd";
import React from "react";

export type AccountFormName = "signup" | "login" | "change password";

export interface IAccountFormsDropdownProps {
  value: AccountFormName;
  onChange: (formName: AccountFormName) => void;
}

const AccountFormsDropdown: React.SFC<IAccountFormsDropdownProps> = props => {
  const overlay = (
    <Menu onClick={({ key }) => props.onChange(key as AccountFormName)}>
      <Menu.Item key="signup">Signup</Menu.Item>
      <Menu.Item key="login">Login</Menu.Item>
      <Menu.Item key="change password">Change Password</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={overlay}>
      <StyledAccountFormValue>{props.value}</StyledAccountFormValue>
    </Dropdown>
  );
};

export default AccountFormsDropdown;

const StyledAccountFormValue = styled.div({
  textTransform: "capitalize"
});
