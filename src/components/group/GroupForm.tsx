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
const groupExistsErrorMessage = "Group with the same name exists";

export interface IGroupFormValues {
  customId: string;
  type: BlockType;
  name: string;
  description?: string;
  parent?: string;
}

type GroupFormFormikProps = FormikProps<IGroupFormValues>;
export type GroupFormErrors = IFormikFormErrors<IGroupFormValues>;

export interface IGroupFormProps {
  possibleParents: IBlock[];
  value: IGroupFormValues;
  onClose: () => void;
  onSubmit: (values: IGroupFormValues) => void;

  submitLabel?: React.ReactNode;
  isSubmitting?: boolean;
  errors?: GroupFormErrors;
}

const defaultSubmitLabel = "Create Group";

const GroupForm: React.FC<IGroupFormProps> = (props) => {
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
  const groupIDs = (immediateParent && immediateParent!.groups) || [];
  const groups = useSelector<IReduxState, IBlock[]>((state) =>
    getBlocksAsArray(state, groupIDs)
  );
  const blockToUpdate = useSelector<IReduxState, IBlock | undefined>((state) =>
    getBlock(state, value.customId)
  );

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

  const renderParentInput = (formikProps: GroupFormFormikProps) => {
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

  const renderNameInput = (formikProps: GroupFormFormikProps) => {
    const { touched, handleBlur, setFieldValue, values, errors } = formikProps;

    // TODO: can this be more efficient?
    const groupNameError = errors.name || getGroupExistsError(values.name);

    return (
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
            const val = event.target.value;
            setFieldValue("name", val);
          }}
          value={values.name}
          placeholder="Group name"
        />
      </Form.Item>
    );
  };

  const renderDescriptionInput = (formikProps: GroupFormFormikProps) => {
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
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.description}
          placeholder="Group description"
        />
      </Form.Item>
    );
  };

  const preSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    formikProps: GroupFormFormikProps
  ) => {
    event.preventDefault();

    const { errors, values, handleSubmit } = formikProps;

    // TODO: can this be more efficient?
    const groupNameError = errors.name || getGroupExistsError(values.name);

    if (!groupNameError) {
      handleSubmit(event);
    }
  };

  const renderForm = (formikProps: GroupFormFormikProps) => {
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

GroupForm.defaultProps = {
  submitLabel: defaultSubmitLabel,
};

export default React.memo(GroupForm);
