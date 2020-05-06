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

  disabled?: boolean;
  error?: IAddCollaboratorFormItemError;
}

const AddCollaboratorFormItem = React.memo<IAddCollaboratorFormItemProps>(
  (props) => {
    const { error, onChange, onDelete, value, disabled } = props;
    const itemError = error || {};

    return (
      <StyledContainer>
        <StyledFormItem>
          <Input
            placeholder="Enter recipient email address"
            value={value.email}
            autoComplete="email"
            onChange={(event) => {
              onChange({ ...value, email: event.target.value });
            }}
            disabled={disabled}
          />
          {itemError.email && <FormError error={itemError.email} />}
        </StyledFormItem>
        <StyledFormItem>
          <Message
            placeholder="Enter collaboration request message"
            value={value.body}
            onChange={(body) => {
              onChange({ ...value, body });
            }}
            disabled={disabled}
          />
          {itemError.body && <FormError error={itemError.body} />}
        </StyledFormItem>
        <StyledFormItem>
          <ExpiresAt
            placeholder="Expires At"
            value={value.expiresAt}
            minDate={moment().subtract(1, "day").endOf("day")}
            onChange={(date) => {
              onChange({ ...value, expiresAt: date });
            }}
            disabled={disabled}
          />
        </StyledFormItem>
        <StyledFormItemButtonContainer>
          <Button
            block
            danger
            onClick={() => onDelete(value)}
            type="primary"
            disabled={disabled}
          >
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
  marginTop: "8px",
});

const StyledFormItemButtonContainer = styled.div({
  marginTop: "16px",
});
