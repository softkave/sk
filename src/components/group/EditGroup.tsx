import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";

import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import FormError from "../form/FormError";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormInternals";
import { getGlobalError, submitHandler } from "../formik-utils";
import modalWrap from "../modalWrap.jsx";

const groupExistsErrorMessage = "Group with the same name exists";
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(blockConstants.maxNameLength)
    .matches(textPattern)
    .required(),
  description: yup
    .string()
    .max(blockConstants.maxDescriptionLength)
    .matches(textPattern)
});

// TODO: untouched fields are showing error message because of a re-render
// const requiredFields = ["name"];

interface IEditGroupValues {
  name: string;
  description?: string;
}

export interface IEditGroupProps {
  onSubmit: (values: IEditGroupValues) => void | Promise<void>;
  submitLabel?: string;
  data?: IEditGroupValues;
  existingGroups?: string[];
}

const defaultSubmitLabel = "Create Group";

class EditGroup extends React.Component<IEditGroupProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel,
    existingGroups: []
  };

  public render() {
    const { data, submitLabel, onSubmit } = this.props;

    // TODO: Integrate internal validation
    return (
      <Formik
        initialValues={data!}
        validationSchema={validationSchema}
        onSubmit={(values, props) => {
          // TODO: Test for these errors during change, maybe by adding unique or test function to the schema
          const error = this.validate(values);

          if (error) {
            props.setErrors(error);
            props.setSubmitting(false);
            return;
          }

          (values as any).type = "group";
          submitHandler(onSubmit, values, props);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => {
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
                      label="Group Name"
                      help={
                        touched.name && <FormError>{errors.name}</FormError>
                      }
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
                      help={<FormError>{errors.description}</FormError>}
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
        }}
      </Formik>
    );
  }

  private validate(values: IEditGroupValues) {
    const { existingGroups } = this.props;

    if (existingGroups && existingGroups.indexOf(values.name) !== -1) {
      return { name: groupExistsErrorMessage };
    }
  }
}

export default modalWrap(EditGroup, "Group");