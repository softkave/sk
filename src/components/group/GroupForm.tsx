import { Button, Form, Input, Typography } from "antd";
import { Formik, FormikProps } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/store";
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

  formOnly?: boolean;
  group?: IBlock;
  isSubmitting?: boolean;
  errors?: GroupFormErrors;
}

const GroupForm: React.FC<IGroupFormProps> = (props) => {
  const {
    formOnly,
    group,
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
  const groups = useSelector<IAppState, IBlock[]>((state) =>
    getBlocksAsArray(state, groupIDs)
  );
  const blockToUpdate = useSelector<IAppState, IBlock | undefined>((state) =>
    getBlock(state, value.customId)
  );

  const formikRef = useInsertFormikErrors(externalErrors);

  const getGroupExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();
      const existingGroup = groups.find(
        (grp) => grp.name.toLowerCase() === name
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

  const renderNameInput = (formikProps: GroupFormFormikProps) => {
    const { touched, values, errors } = formikProps;

    // TODO: can this be more efficient?
    const groupNameError = errors.name || getGroupExistsError(values.name);

    return (
      <Form.Item
        required
        label="Group Name"
        help={touched.name && <FormError error={groupNameError} />}
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
            placeholder="Enter group name"
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

  const renderDescriptionInput = (formikProps: GroupFormFormikProps) => {
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
            placeholder="Enter group description"
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

  const getSubmitLabel = () => {
    if (isSubmitting) {
      if (group) {
        return "Saving Changes";
      } else {
        return "Creating Group";
      }
    } else {
      if (group) {
        return "Save Changes";
      } else {
        return "Create Group";
      }
    }
  };

  const renderControls = () => {
    return (
      <StyledContainer>
        <StyledButton
          block
          danger
          // type="primary"
          // type="link"
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

  const renderForm = (formikProps: GroupFormFormikProps) => {
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

export default React.memo(GroupForm);
