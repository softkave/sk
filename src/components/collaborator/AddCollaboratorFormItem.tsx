import styled from "@emotion/styled";
import { Button, Input } from "antd";
import moment from "moment";
import React from "react";
import FormError from "../form/FormError";
import { IFormikFormErrors } from "../form/formik-utils";
import ExpiresAt from "./ExpiresAt";
import Message from "./Message";

export interface IAddCollaboratorFormItemValues {
  email: string;
  body?: string;
  expiresAt?: number;
}

export type IAddCollaboratorFormItemError = IFormikFormErrors<
  IAddCollaboratorFormItemValues
>;

export interface IAddCollaboratorFormItemProps {
  value: IAddCollaboratorFormItemValues;
  onChange: (value: IAddCollaboratorFormItemValues) => void;
  onDelete: (value: IAddCollaboratorFormItemValues) => void;
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

const StyledContainer = styled.div({});

const StyledFormItem = styled.div({
  marginTop: "8px"
});

const StyledFormItemButtonContainer = styled.div({
  marginTop: "16px"
});
