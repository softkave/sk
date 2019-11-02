import { Button, Form, Input } from "antd";
import React from "react";
import FormError from "../form/FormError";
import { IFormikFormBaseProps } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormStyledComponents";

export interface IEditOrgFormValues {
  name: string;
  description?: string;
}

export interface IEditOrgProps
  extends IFormikFormBaseProps<IEditOrgFormValues> {
  submitLabel?: string;
}

// TODO: Move all stray strings to a central location
const defaultSubmitLabel = "Create Organization";

export default class EditOrgForm extends React.Component<IEditOrgProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel
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
      touched
    } = this.props;
    const formErrors = errors;

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormScrollList>
            <FormBody>
              {formErrors.error && (
                <Form.Item>
                  <FormError error={formErrors.error} />
                </Form.Item>
              )}
              <Form.Item
                label="Organization Name"
                help={touched.name && <FormError>{formErrors.name}</FormError>}
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
              >
                <Input.TextArea
                  autosize={{ minRows: 2, maxRows: 6 }}
                  autoComplete="off"
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                />
              </Form.Item>
            </FormBody>
          </FormScrollList>
          <FormControls>
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
}
