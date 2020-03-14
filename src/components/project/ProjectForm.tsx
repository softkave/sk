import { Button, Form, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
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
  parent?: string;
}

export interface IProjectFormProps
  extends IFormikFormBaseProps<IProjectFormValues> {
  possibleParents: IBlock[];
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
    setFieldValue,
    possibleParents,
    onClose
  } = props;

  // return <span>Inside Project</span>;

  const immediateParentID = values.parent;
  const immediateParent = possibleParents.find(
    parent => parent.customId === immediateParentID
  );
  const projectIDs = (immediateParent && immediateParent!.projects) || [];
  const projects = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, projectIDs)
  );
  const blockToUpdate = useSelector<IReduxState, IBlock | undefined>(state =>
    getBlock(state, values.customId)
  );

  const globalError = getGlobalError(errors);

  const getProjectExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();
      const existingProject = projects.find(
        project => project.name.toLowerCase() === name
      );

      if (
        existingProject &&
        existingProject.customId !== blockToUpdate?.customId
      ) {
        return projectExistsErrorMessage;
      }
    }
  };

  const renderParentInput = () => (
    <Form.Item
      label="Parent"
      help={touched.parent && <FormError>{errors.parent}</FormError>}
    >
      <BlockParentSelection
        value={values.parent}
        possibleParents={possibleParents}
        onChange={value => setFieldValue("parent", value)}
      />
    </Form.Item>
  );

  // TODO: can this be more efficient?
  const projectNameError = errors.name || getProjectExistsError(values.name);
  const renderNameInput = () => (
    <Form.Item
      label="Project Name"
      help={touched.name && <FormError>{projectNameError}</FormError>}
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
        autoSize={{ minRows: 2, maxRows: 6 }}
        autoComplete="off"
        name="description"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.description}
      />
    </Form.Item>
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectNameError) {
      handleSubmit(event);
    }
  };

  return (
    <StyledForm onSubmit={onSubmit}>
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
