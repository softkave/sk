import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";

import { blockConstants } from "../../../models/block/constants";
import { textPattern } from "../../../models/user/descriptor";
import FormError from "../../form/FormError";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../../form/FormInternals";
import { getGlobalError, submitHandler } from "../../formik-utils";
import modalWrap from "../../modalWrap.jsx";

const projectExistsErrorMessage = "Project with the same name exists";

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

interface IEditProjectValues {
  name: string;
  description?: string;
}

export interface IEditProjectProps {
  onSubmit: (values: IEditProjectValues) => void | Promise<void>;
  submitLabel?: string;
  data?: IEditProjectValues;
  existingProjects?: string[];
}

const defaultSubmitLabel = "Create Project";

class EditProject extends React.Component<IEditProjectProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel,
    existingProjects: []
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

          (values as any).type = "project";
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
                      label="Project Name"
                      help={<FormError>{errors.name}</FormError>}
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

  private validate(values: IEditProjectValues) {
    const { existingProjects } = this.props;

    if (existingProjects && existingProjects.indexOf(values.name) !== -1) {
      return { name: projectExistsErrorMessage };
    }
  }
}

export default modalWrap(EditProject, "Project");
