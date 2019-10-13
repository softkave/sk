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
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormInternals";
import { applyOperationToFormik, getGlobalError } from "../formik-utils";
import modalWrap from "../modalWrap.jsx";

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

interface IEditOrgData {
  customId: string;
  type: BlockType;
  name: string;
  description?: string;
}

export interface IEditOrgProps {
  onSubmit: (values: IEditOrgData) => void | Promise<void>;
  submitLabel?: string;
  data?: IEditOrgData;
  operation?: IOperation;
}

// TODO: Move all stray strings to a central location
const defaultSubmitLabel = "Create Organization";

class EditOrg extends React.Component<IEditOrgProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel
  };

  private formikRef: React.RefObject<Formik<IEditOrgData>> = React.createRef();

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
        initialValues={cast<IEditOrgData>(data || {})}
        validationSchema={validationSchema}
        onSubmit={values => {
          values.type = "org";
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
                      label="Organization Name"
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
}

export default modalWrap(EditOrg, "Org");
