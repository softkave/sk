import styled from "@emotion/styled";
import { Button, Input } from "antd";
import moment from "moment";
import React from "react";

import FormError from "../form/FormError";
import ACFExpiresAt from "./ACFExpiresAt";
import ACFMessage from "./ACFMessage";

export interface IACFItemValue {
  email: string;
  body?: string;
  expiresAt?: number;
}

export interface IACFItemError {
  email?: string;
  body?: string;
  expiresAt?: string;
}

export interface IACFItemProps {
  value: IACFItemValue;
  onChange: (value: IACFItemValue) => void;
  onDelete: (value: IACFItemValue) => void;
  error?: IACFItemError;
}

const ACFItem = React.memo<IACFItemProps>(props => {
  const { error, onChange, onDelete, value } = props;
  const itemError = error || {};

  return (
    <StyledContainer>
      <StyledFormItem>
        <Input
          placeholder="Email Address"
          value={value.email}
          autoComplete="email"
          onChange={event => {
            onChange({ ...value, email: event.target.value });
          }}
        />
        {itemError.email && <FormError>{itemError.email}</FormError>}
      </StyledFormItem>
      <StyledFormItem>
        <ACFMessage
          placeholder="Message"
          value={value.body}
          onChange={body => {
            onChange({ ...value, body });
          }}
        />
        {itemError.body && <FormError>{itemError.body}</FormError>}
      </StyledFormItem>
      <StyledFormItem>
        <ACFExpiresAt
          placeholder="Expires At"
          value={value.expiresAt}
          minDate={moment()
            .subtract(1, "day")
            .endOf("day")}
          onChange={date => {
            onChange({ ...value, expiresAt: date });
          }}
        />
      </StyledFormItem>
      <StyledFormItemButtonContainer>
        <Button block onClick={() => onDelete(value)} type="danger">
          Delete
        </Button>
      </StyledFormItemButtonContainer>
    </StyledContainer>
  );
});

export default ACFItem;

const StyledContainer = styled.div({
  backgroundColor: "#fafafa",
  padding: "12px",
  borderRadius: "8px"
});

const StyledFormItem = styled.div({
  marginTop: "8px",

  "&:first-of-type": {
    marginTop: 0
  }
});

const StyledFormItemButtonContainer = styled.div({
  marginTop: "16px"
});
