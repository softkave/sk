import { Button, Form, Input, Typography } from "antd";
import React from "react";
import { IBlock, IBlockLabel, IBlockStatus } from "../../models/block/block";
import { blockErrorMessages } from "../../models/block/blockErrorMessages";
import { blockConstants } from "../../models/block/constants";
import blockValidationSchemas from "../block/validation";
import ColorPicker from "../form/ColorPicker";
import FormError from "../form/FormError";
import { IFormikFormErrors } from "../form/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../form/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";
import Editable from "../utilities/Editable";
import OrgExistsMessage from "./OrgExistsMessage";

export interface IEditOrgFormValues {
  name: string;
  color: string;
  availableLabels: IBlockLabel[];
  availableStatus: IBlockStatus[];
  description?: string;
}

export type EditOrgFormErrors = IFormikFormErrors<IEditOrgFormValues>;

export interface IEditOrgProps {
  value: IEditOrgFormValues;
  onClose: () => void;
  onSubmit: (values: IEditOrgFormValues) => void;

  isSubmitting?: boolean;
  org?: IBlock;
  formOnly?: boolean;
  errors?: EditOrgFormErrors;
}

const EditOrgForm: React.FC<IEditOrgProps> = (props) => {
  const {
    isSubmitting,
    onClose,
    value,
    onSubmit,
    formOnly,
    org,
    errors: externalErrors,
  } = props;

  const { formik, formikChangedFieldsHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value,
      validationSchema: blockValidationSchemas.org,
    },
  });

  // TODO: find a better way to implement this
  // TODO: test your error handling in all forms
  const doesOrgExist = (
    errorMessages: IFormikFormErrors<IEditOrgFormValues>
  ) => {
    if (errorMessages) {
      let messages: string[] = [];

      if (errorMessages.error) {
        messages = messages.concat(errorMessages.error);
      }

      if (errorMessages.name) {
        messages = messages.concat(errorMessages.name);
      }

      return messages.find((message) => {
        return message === blockErrorMessages.orgExists;
      });
    }
  };

  const roi = () => {
    const orgExistsMessage = doesOrgExist(formik.errors as any);

    const input = (
      <Input
        autoComplete="off"
        name="name"
        onBlur={formik.handleBlur}
        onChange={(evt) => {
          formik.handleChange(evt);
          formikChangedFieldsHelpers.addField("name");
        }}
        value={formik.values.name}
        placeholder="Org name"
        disabled={isSubmitting}
        maxLength={blockConstants.maxNameLength}
      />
    );

    let editable: React.ReactNode = null;

    if (!formOnly) {
      editable = (
        <Editable
          // withControls
          disabled={isSubmitting}
          render={(isEditing) => {
            if (isEditing) {
              return input;
            }

            return (
              <Typography.Paragraph strong>
                {formik.values.name}
              </Typography.Paragraph>
            );
          }}
          // controlsEventHandler={}
        />
      );
    }

    return (
      <Form.Item
        help={
          formik.touched.name &&
          (!!orgExistsMessage ? (
            <OrgExistsMessage message={orgExistsMessage} />
          ) : (
            <FormError error={formik.errors.name} />
          ))
        }
        style={{ width: "100%" }}
      >
        {formOnly ? input : editable}
      </Form.Item>
    );
  };

  const renderColorInput = () => {
    return (
      <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
        <ColorPicker
          value={value.color}
          disabled={isSubmitting}
          onChange={(val) => {
            formik.setFieldValue("color", val);
            formikChangedFieldsHelpers.addField("color");
          }}
        />
      </StyledContainer>
    );
  };

  const renderDescriptionInput = () => {
    const { touched, handleBlur, handleChange, values, errors } = formik;

    return (
      <Form.Item
        help={
          touched.description && <FormError>{errors.description}</FormError>
        }
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
            placeholder="Enter organization description"
            disabled={isSubmitting}
            maxLength={blockConstants.maxDescriptionLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formik.setFieldValue("description", val);
              },
            }}
          >
            {values.description || ""}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const renderDesc = () => {
    const input = (
      <Input.TextArea
        autoSize={{ minRows: 4, maxRows: 8 }}
        autoComplete="off"
        name="description"
        onBlur={formik.handleBlur}
        onChange={(evt) => {
          formik.handleChange(evt);
          formikChangedFieldsHelpers.addField("description");
        }}
        value={formik.values.description}
        placeholder="Org description"
        disabled={isSubmitting}
        maxLength={blockConstants.maxDescriptionLength}
      />
    );

    let editable: React.ReactNode = null;

    if (!formOnly) {
      editable = (
        <Editable
          // withControls
          disabled={isSubmitting}
          render={(isEditing) => {
            if (isEditing) {
              return input;
            }

            return (
              <Typography.Paragraph strong>
                {formik.values.description || ""}
              </Typography.Paragraph>
            );
          }}
          // controlsEventHandler={}
        />
      );
    }

    return (
      <Form.Item
        help={
          formik.touched.description && (
            <FormError>{formik.errors.description}</FormError>
          )
        }
      >
        {formOnly ? input : editable}
      </Form.Item>
    );
  };

  const getSubmitLabel = () => {
    if (isSubmitting) {
      if (org) {
        return "Saving Changes";
      } else {
        return "Creating Org";
      }
    } else {
      if (org) {
        return "Save Changes";
      } else {
        return "Create Org";
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

  const renderForm = () => {
    const { handleSubmit } = formik;
    const errors = (formik.errors as any) as EditOrgFormErrors;

    return (
      <StyledForm onSubmit={handleSubmit}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            <Form.Item>
              <Typography.Title level={4}>Organization</Typography.Title>
            </Form.Item>
            {errors.error && <FormError error={errors.error} />}
            <StyledContainer>
              <StyledContainer s={{ flex: 1, marginRight: "16px" }}>
                {roi()}
              </StyledContainer>
              {renderColorInput()}
            </StyledContainer>
            {renderDesc()}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return renderForm();
};

export default React.memo(EditOrgForm);
