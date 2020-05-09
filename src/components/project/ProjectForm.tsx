import { Button, Form, Input, Typography } from "antd";
import { Formik, FormikProps } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import BlockParentSelection from "../block/BlockParentSelection";
import blockValidationSchemas from "../block/validation";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../form/FormStyledComponents";
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";

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

  formOnly?: boolean;
  project?: IBlock;
  isSubmitting?: boolean;
  errors?: ProjectFormErrors;
}

const ProjectForm: React.FC<IProjectFormProps> = (props) => {
  const {
    formOnly,
    project,
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

  const formikRef = useInsertFormikErrors(externalErrors);

  const getProjectExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();
      const existingProject = projects.find(
        (proj) => proj.name.toLowerCase() === name
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
        help={touched.parent && <FormError error={errors.parent} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <BlockParentSelection
          value={values.parent}
          possibleParents={possibleParents}
          onChange={(val) => setFieldValue("parent", val)}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderNameInput = (formikProps: ProjectFormFormikProps) => {
    const { touched, values, errors } = formikProps;

    // TODO: can this be more efficient?
    const projectNameError = errors.name || getProjectExistsError(values.name);

    return (
      <Form.Item
        required
        label="Project Name"
        help={touched.name && <FormError error={projectNameError} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {formOnly ? (
          <Input
            autoComplete="off"
            name="name"
            onBlur={formikProps.handleBlur}
            onChange={formikProps.handleChange}
            value={values.name}
            placeholder="Enter project name"
            disabled={isSubmitting}
            maxLength={blockConstants.maxNameLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formikProps.setFieldValue("name", val);
              },
            }}
          >
            {values.name}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const renderDescriptionInput = (formikProps: ProjectFormFormikProps) => {
    const { touched, handleBlur, values, errors, handleChange } = formikProps;

    return (
      <Form.Item
        label="Description"
        help={touched.description && <FormError error={errors.description} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {formOnly ? (
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            name="description"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.description}
            placeholder="Enter project description"
            disabled={isSubmitting}
            maxLength={blockConstants.maxDescriptionLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formikProps.setFieldValue("description", val);
              },
            }}
          >
            {values.description || ""}
          </Typography.Paragraph>
        )}
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

  const getSubmitLabel = () => {
    if (isSubmitting) {
      if (project) {
        return "Saving Changes";
      } else {
        return "Creating Project";
      }
    } else {
      if (project) {
        return "Save Changes";
      } else {
        return "Create Project";
      }
    }
  };

  const renderControls = () => {
    return (
      <StyledContainer>
        <StyledButton
          block
          danger
          type="primary"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Close
        </StyledButton>
        <Button block type="primary" htmlType="submit" loading={isSubmitting}>
          {getSubmitLabel()}
        </Button>
      </StyledContainer>
    );
  };

  const renderForm = (formikProps: ProjectFormFormikProps) => {
    const { errors } = formikProps;
    const globalError = getGlobalError(errors);
    formikRef.current = formikProps;

    return (
      <StyledForm onSubmit={(evt) => preSubmit(evt, formikProps)}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderNameInput(formikProps)}
            {renderDescriptionInput(formikProps)}
            {renderParentInput(formikProps)}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return (
    <Formik
      initialValues={value}
      validationSchema={blockValidationSchemas.org}
      onSubmit={onSubmit}
    >
      {(formikProps) => renderForm(formikProps)}
    </Formik>
  );
};

export default React.memo(ProjectForm);
