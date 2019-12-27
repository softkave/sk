import { Button, Form, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import BlockParentSelection from "../block/BlockParentSelection";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormBaseProps } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  StyledForm
} from "../form/FormStyledComponents";
import StyledButton from "../styled/Button";

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
  parents: IBlock[];
  submitLabel?: React.ReactNode;
  onClose: () => void;
}

const defaultSubmitLabel = "Create Project";

const ProjectForm: React.FC<IProjectFormProps> = props => {
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
    parents,
    onClose
  } = props;

  const parentIDs = values.parents || [];
  const immediateParentID = parentIDs[parentIDs.length - 1];
  const immediateParent = parents.find(
    parent => parent.customId === immediateParentID
  );
  const projectIDs = (immediateParent && immediateParent.projects) || [];
  const projects = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, projectIDs)
  );

  const globalError = getGlobalError(errors);

  // TODO: is ther a way to validate the name on every render, so that when the parent changes,
  // it shows the error, rather than only when the name changes
  const getProjectExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();

      if (
        projects.findIndex(project => project.name.toLowerCase() === name) !==
        -1
      ) {
        console.log("project exists");
        return projectExistsErrorMessage;
      }
    }
  };

  const renderParentInput = () => (
    <Form.Item
      label="Parent"
      help={touched.parents && <FormError>{errors.parents}</FormError>}
    >
      <BlockParentSelection
        value={values.parents}
        parents={parents}
        onChange={value => setFieldValue("parents", value)}
      />
    </Form.Item>
  );

  const renderNameInput = () => (
    <Form.Item
      label="Project Name"
      help={
        touched.name && (
          <FormError>
            {errors.name || getProjectExistsError(values.name)}
          </FormError>
        )
      }
    >
      <Input
        autoComplete="off"
        name="name"
        onBlur={handleBlur}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          setFieldValue("name", value);
        }}
        value={values.name}
      />
    </Form.Item>
  );

  const renderDescriptionInput = () => (
    <Form.Item
      label="Description"
      help={touched.description && <FormError>{errors.description}</FormError>}
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
  );

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormBodyContainer>
        <FormBody>
          {globalError && (
            <Form.Item>
              <FormError error={globalError} />
            </Form.Item>
          )}
          {renderParentInput()}
          {renderNameInput()}
          {renderDescriptionInput()}
        </FormBody>
        <FormControls>
          <StyledButton
            block
            type="danger"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </StyledButton>
          <Button block type="primary" htmlType="submit" loading={isSubmitting}>
            {submitLabel || defaultSubmitLabel}
          </Button>
        </FormControls>
      </FormBodyContainer>
    </StyledForm>
  );
};

ProjectForm.defaultProps = {
  submitLabel: defaultSubmitLabel
};

export default ProjectForm;
