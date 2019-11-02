import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { BlockType } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import IOperation from "../../redux/operations/operation";
import cast from "../../utils/cast";
import FormError from "../form/FormError";
import { applyOperationToFormik, getGlobalError } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormStyledComponents";
import withModal from "../withModal.jsx";

const projectExistsErrorMessage = "Project with the same name exists";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(blockConstants.minNameLength)
    .max(blockConstants.maxNameLength)
    .matches(textPattern)
    .required(),
  description: yup
    .string()
    .max(blockConstants.maxDescriptionLength)
    .matches(textPattern)
});

export interface IEditProjectData {
  customId: string;
  type: BlockType;
  name: string;
  description?: string;
}

interface IEditProjectInternalData extends IEditProjectData {}

export interface IEditProjectProps {
  onSubmit: (values: IEditProjectData) => void | Promise<void>;
  submitLabel?: string;
  data?: IEditProjectData;
  existingProjects?: string[];
  operation?: IOperation;
}

const defaultSubmitLabel = "Create Project";

class EditProject extends React.Component<IEditProjectProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel,
    existingProjects: []
  };

  private formikRef: React.RefObject<
    Formik<IEditProjectInternalData>
  > = React.createRef();

  public componentDidMount() {
    applyOperationToFormik(this.props.operation, this.formikRef);
  }

  public componentDidUpdate() {
    applyOperationToFormik(this.props.operation, this.formikRef);
  }

  public render() {
    const { data, submitLabel, onSubmit } = this.props;

    return (
      <Formik
        ref={this.formikRef}
        initialValues={cast<IEditProjectInternalData>(data || {})}
        validationSchema={validationSchema}
        onSubmit={values => {
          values.type = "project";
          onSubmit(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldError,
          setFieldValue
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
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
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

  private projectExists(name: string) {
    const { existingProjects } = this.props;

    if (existingProjects && existingProjects.indexOf(name) !== -1) {
      return true;
    }
  }
}

export default withModal(EditProject, "Project");
