import { Button, Form, Input } from "antd";
import React from "react";
import { IBlockLabel, IBlockStatus } from "../../models/block/block";
import { blockErrorMessages } from "../../models/block/blockErrorMessages";
import FormError from "../form/FormError";
import { IFormikFormBaseProps, IFormikFormErrors } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  StyledForm,
} from "../form/FormStyledComponents";
import StyledButton from "../styled/Button";
import OrgExistsMessage from "./OrgExistsMessage";

export interface IEditOrgFormValues {
  name: string;
  availableLabels: IBlockLabel[];
  availableStatus: IBlockStatus[];
  description?: string;
}

export interface IEditOrgProps
  extends IFormikFormBaseProps<IEditOrgFormValues> {
  submitLabel?: React.ReactNode;
  onClose: () => void;
}

// TODO: Move all stray strings to a central location
const defaultSubmitLabel = "Create Organization";

export default class EditOrgForm extends React.Component<IEditOrgProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel,
  };

  public render() {
    const {
      submitLabel,
      isSubmitting,
      errors,
      handleBlur,
      handleChange,
      values,
      handleSubmit,
      touched,
      onClose,
    } = this.props;
    const formErrors = errors || {};
    const orgExistsMessage = this.doesOrgExist(formErrors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormBody>
            {formErrors.error && <FormError error={formErrors.error} />}
            <Form.Item
              label="Organization Name"
              help={
                touched.name &&
                (!!orgExistsMessage ? (
                  <OrgExistsMessage message={orgExistsMessage} />
                ) : (
                  <FormError error={formErrors.name} />
                ))
              }
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                autoComplete="off"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              help={
                touched.description && (
                  <FormError>{errors.description}</FormError>
                )
              }
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                autoComplete="off"
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
              />
            </Form.Item>
          </FormBody>
          <FormControls>
            <StyledButton
              block
              danger
              type="primary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </StyledButton>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              {submitLabel || defaultSubmitLabel}
            </Button>
          </FormControls>
        </FormBodyContainer>
      </StyledForm>
    );
  }

  private doesOrgExist(errorMessages: IFormikFormErrors<IEditOrgFormValues>) {
    if (errorMessages) {
      let messages: string[] = [];

      if (errorMessages.error) {
        messages = messages.concat(errorMessages.error);
      }

      if (errorMessages.name) {
        messages = messages.concat(errorMessages.name);
      }

      return messages.find((message) => {
        return message === blockErrorMessages.orgExists;
      });
    }
  }
}
