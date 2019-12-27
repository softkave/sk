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
  submitLabel?: React.ReactNode;
  parents: IBlock[];
  onClose: () => void;
}

const defaultSubmitLabel = "Create Group";

const GroupForm: React.FC<IGroupFormProps> = props => {
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
  const groupIDs = (immediateParent && immediateParent.groups) || [];
  const groups = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, groupIDs)
  );

  const globalError = getGlobalError(errors);

  const getGroupExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();

      if (groups.findIndex(group => group.name.toLowerCase() === name) !== -1) {
        return groupExistsErrorMessage;
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
        onChange={value => {
          setFieldValue("parents", value);
        }}
      />
    </Form.Item>
  );

  const renderNameInput = () => (
    <Form.Item
      label="Group Name"
      help={
        touched.name && (
          <FormError>
            {errors.name || getGroupExistsError(values.name)}
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

GroupForm.defaultProps = {
  submitLabel: defaultSubmitLabel
};

export default GroupForm;
