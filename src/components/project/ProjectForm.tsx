import { Button, Form, Input } from "antd";
import React from "react";
import { BlockType } from "../../models/block/block";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormBaseProps } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  StyledForm
} from "../form/FormStyledComponents";

// TODO: Move to error messages file
const projectExistsErrorMessage = "Project with the same name exists";

export interface IProjectFormValues {
  customId: string;
  type: BlockType;
  name: string;
  description?: string;
  parents?: string[];
}

export interface IProjectFormProps
  extends IFormikFormBaseProps<IProjectFormValues> {
  // parents: IBlock[];
  submitLabel?: React.ReactNode;
  existingProjects?: string[];
}

const defaultSubmitLabel = "Create Project";

export default class ProjectForm extends React.Component<IProjectFormProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel,
    existingProjects: []
  };

  public render() {
    const {
      submitLabel,
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      setFieldError,
      setFieldValue
      // parents
    } = this.props;

    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormBody>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {/* <Form.Item
                label="Parent Block"
                help={
                  touched.parents && <FormError>{errors.parents}</FormError>
                }
              >
                <BlockParentSelection
                  value={values.parents}
                  parents={parents}
                  onChange={parentIDs => setFieldValue("parents", parentIDs)}
                />
              </Form.Item> */}
            <Form.Item
              label="Project Name"
              help={touched.name && <FormError>{errors.name}</FormError>}
            >
              <Input
                autoComplete="off"
                name="name"
                onBlur={handleBlur}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;

                  setFieldValue("name", value);

                  if (value && value.length > 0) {
                    if (this.projectExists(value)) {
                      setFieldError("name", projectExistsErrorMessage);
                    }
                  }
                }}
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

  private projectExists(name: string) {
    const { existingProjects } = this.props;

    if (existingProjects && existingProjects.indexOf(name) !== -1) {
      return true;
    }
  }
}
