import styled from "@emotion/styled";
import { Button, Input } from "antd";
import moment from "moment";
import React from "react";
import FormError from "../form/FormError";
import ExpiresAt from "./ExpiresAt";
import Message from "./Message";

export interface IAddCollaboratorFormItemData {
  email: string;
  body?: string;
  expiresAt?: number;
}

export interface IAddCollaboratorFormItemError {
  email?: string;
  body?: string;
  expiresAt?: string;
}

export interface IAddCollaboratorFormItemProps {
  value: IAddCollaboratorFormItemData;
  onChange: (value: IAddCollaboratorFormItemData) => void;
  onDelete: (value: IAddCollaboratorFormItemData) => void;
  error?: IAddCollaboratorFormItemError;
}

const AddCollaboratorFormItem = React.memo<IAddCollaboratorFormItemProps>(
  props => {
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
          <Message
            placeholder="Message"
            value={value.body}
            onChange={body => {
              onChange({ ...value, body });
            }}
          />
          {itemError.body && <FormError>{itemError.body}</FormError>}
        </StyledFormItem>
        <StyledFormItem>
          <ExpiresAt
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
  }
);

export default AddCollaboratorFormItem;

const StyledContainer = styled.div({
  backgroundColor: "#e7e7e7",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "16px"
});

const StyledFormItem = styled.div({
  marginTop: "8px",

  ["&:first-of-type"]: {
    marginTop: 0
  }
});

const StyledFormItemButtonContainer = styled.div({
  marginTop: "16px"
});