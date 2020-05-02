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
  StyledForm,
} from "../form/FormStyledComponents";
import StyledButton from "../styled/Button";

// TODO: Move to a central location
const groupExistsErrorMessage = "Group with the same name exists";

export interface IGroupFormValues {
  customId: string;
  type: BlockType;
  name: string;
  description?: string;
  parent?: string;
}

export interface IGroupFormProps
  extends IFormikFormBaseProps<IGroupFormValues> {
  submitLabel?: React.ReactNode;
  possibleParents: IBlock[];
  onClose: () => void;
}

const defaultSubmitLabel = "Create Group";

const GroupForm: React.FC<IGroupFormProps> = (props) => {
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
    onClose,
  } = props;

  const immediateParentID = values.parent;
  const immediateParent = possibleParents.find(
    (parent) => parent.customId === immediateParentID
  );
  const groupIDs = (immediateParent && immediateParent.groups) || [];
  const groups = useSelector<IReduxState, IBlock[]>((state) =>
    getBlocksAsArray(state, groupIDs)
  );
  const blockToUpdate = useSelector<IReduxState, IBlock | undefined>((state) =>
    getBlock(state, values.customId)
  );

  const globalError = getGlobalError(errors);

  const getGroupExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();
      const existingGroup = groups.find(
        (group) => group.name.toLowerCase() === name
      );

      if (existingGroup && existingGroup.customId !== blockToUpdate?.customId) {
        return groupExistsErrorMessage;
      }
    }
  };

  const renderParentInput = () => (
    <Form.Item
      label="Parent"
      help={touched.parent && <FormError>{errors.parent}</FormError>}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <BlockParentSelection
        value={values.parent}
        possibleParents={possibleParents}
        onChange={(value) => {
          setFieldValue("parent", value);
        }}
      />
    </Form.Item>
  );

  const groupNameError = errors.name || getGroupExistsError(values.name);
  const renderNameInput = () => (
    <Form.Item
      label="Group Name"
      help={touched.name && <FormError>{groupNameError}</FormError>}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
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
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
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

    if (!groupNameError) {
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
            danger
            type="primary"
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

GroupForm.defaultProps = {
  submitLabel: defaultSubmitLabel,
};

export default GroupForm;
