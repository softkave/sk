import { Button, Form, Input } from "antd";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import BlockParentSelection from "../block/BlockParentSelection";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormBaseProps } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormStyledComponents";

// TODO: Move to a central location
const groupExistsErrorMessage = "Group with the same name exists";

export interface IGroupFormValues {
  customId: string;
  type: BlockType;
  name: string;
  description?: string;
  parents?: string[];
}

export interface IGroupFormProps
  extends IFormikFormBaseProps<IGroupFormValues> {
  submitLabel?: string;
  existingGroups?: string[];
  parents: IBlock[];
}

const defaultSubmitLabel = "Create Group";

export default class GroupForm extends React.Component<IGroupFormProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel,
    existingGroups: []
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
      setFieldValue,
      parents
    } = this.props;

    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormScrollList>
            <FormBody>
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
              <Form.Item
                label="Parent"
                help={
                  touched.parents && <FormError>{errors.parents}</FormError>
                }
              >
                <BlockParentSelection
                  value={values.parents}
                  parents={parents}
                  onChange={parentIDs => setFieldValue("parents", parentIDs)}
                />
              </Form.Item>
              <Form.Item
                label="Group Name"
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
                      if (this.groupExists(value)) {
                        setFieldError("name", groupExistsErrorMessage);
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

  private groupExists(name: string) {
    const { existingGroups } = this.props;

    if (existingGroups && existingGroups.indexOf(name) !== -1) {
      return true;
    }
  }
}
