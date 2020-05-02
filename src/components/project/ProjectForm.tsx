import { Button, Form, Input } from "antd";
import { Formik, FormikProps } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import BlockParentSelection from "../block/BlockParentSelection";
import blockValidationSchemas from "../block/validation";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  StyledForm,
} from "../form/FormStyledComponents";
import StyledButton from "../styled/Button";

// TODO: Move to error messages file
const projectExistsErrorMessage = "Project with the same name exists";

export interface IProjectFormValues {
  customId: string;
  type: BlockType;
  name: string;
  description?: string;
  parent?: string;
}

type ProjectFormFormikProps = FormikProps<IProjectFormValues>;
export type ProjectFormErrors = IFormikFormErrors<IProjectFormValues>;

export interface IProjectFormProps {
  possibleParents: IBlock[];
  value: IProjectFormValues;
  onClose: () => void;
  onSubmit: (values: IProjectFormValues) => void;

  submitLabel?: React.ReactNode;
  isSubmitting?: boolean;
  errors?: ProjectFormErrors;
}

const defaultSubmitLabel = "Create Project";

const ProjectForm: React.FC<IProjectFormProps> = (props) => {
  const {
    submitLabel,
    isSubmitting,
    possibleParents,
    onClose,
    value,
    onSubmit,
    errors: externalErrors,
  } = props;

  const immediateParentID = value.parent;
  const immediateParent = possibleParents.find(
    (parent) => parent.customId === immediateParentID
  );
  const projectIDs = (immediateParent && immediateParent!.projects) || [];
  const projects = useSelector<IReduxState, IBlock[]>((state) =>
    getBlocksAsArray(state, projectIDs)
  );
  const blockToUpdate = useSelector<IReduxState, IBlock | undefined>((state) =>
    getBlock(state, value.customId)
  );

  const getProjectExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();
      const existingProject = projects.find(
        (project) => project.name.toLowerCase() === name
      );

      if (
        existingProject &&
        existingProject.customId !== blockToUpdate?.customId
      ) {
        return projectExistsErrorMessage;
      }
    }
  };

  const renderParentInput = (formikProps: ProjectFormFormikProps) => {
    const { touched, errors, values, setFieldValue } = formikProps;

    return (
      <Form.Item
        label="Parent"
        help={touched.parent && <FormError>{errors.parent}</FormError>}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <BlockParentSelection
          value={values.parent}
          possibleParents={possibleParents}
          onChange={(val) => setFieldValue("parent", val)}
        />
      </Form.Item>
    );
  };

  const renderNameInput = (formikProps: ProjectFormFormikProps) => {
    const { touched, handleBlur, setFieldValue, values, errors } = formikProps;

    // TODO: can this be more efficient?
    const projectNameError = errors.name || getProjectExistsError(values.name);

    return (
      <Form.Item
        label="Project Name"
        help={touched.name && <FormError>{projectNameError}</FormError>}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input
          autoComplete="off"
          name="name"
          onBlur={handleBlur}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.value;
            setFieldValue("name", val);
          }}
          value={values.name}
          placeholder="Project name"
        />
      </Form.Item>
    );
  };

  const renderDescriptionInput = (formikProps: ProjectFormFormikProps) => {
    const { touched, handleBlur, values, errors, handleChange } = formikProps;

    return (
      <Form.Item
        label="Description"
        help={
          touched.description && <FormError>{errors.description}</FormError>
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          name="description"
          placeholder="Project description"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.description}
        />
      </Form.Item>
    );
  };

  const preSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    formikProps: ProjectFormFormikProps
  ) => {
    event.preventDefault();

    const { errors, values, handleSubmit } = formikProps;

    // TODO: can this be more efficient?
    const projectNameError = errors.name || getProjectExistsError(values.name);

    if (!projectNameError) {
      handleSubmit(event);
    }
  };

  const renderForm = (formikProps: ProjectFormFormikProps) => {
    const { errors } = formikProps;
    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={(evt) => preSubmit(evt, formikProps)}>
        <FormBodyContainer>
          <FormBody>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderParentInput(formikProps)}
            {renderNameInput(formikProps)}
            {renderDescriptionInput(formikProps)}
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
  };

  return (
    <Formik
      // @ts-ignore
      initialErrors={externalErrors}
      initialValues={value}
      validationSchema={blockValidationSchemas.org}
      onSubmit={onSubmit}
    >
      {(formikProps) => renderForm(formikProps)}
    </Formik>
  );
};

ProjectForm.defaultProps = {
  submitLabel: defaultSubmitLabel,
};

export default React.memo(ProjectForm);
