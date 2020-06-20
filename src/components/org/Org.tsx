import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import { Button, Form, Input, Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
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
import StyledContainer from "../styled/Container";
import Editable from "../utilities/Editable";
import OrgExistsMessage from "./OrgExistsMessage";

export interface IOrgValues {
  name: string;
  color: string;
  description?: string;
}

export type OrgErrors = IFormikFormErrors<IOrgValues>;

export interface IEditOrgProps {
  value: IOrgValues;
  onClose: () => void;
  onSubmit: (values: IOrgValues) => void;

  isSubmitting?: boolean;
  org?: IBlock;
  formOnly?: boolean;
  errors?: OrgErrors;
}

const Org: React.FC<IEditOrgProps> = (props) => {
  const {
    isSubmitting,
    onClose,
    value,
    onSubmit,
    formOnly,
    org,
    errors: externalErrors,
  } = props;

  // TODO: test your error handling in all forms

  const { formik, formikChangedFieldsHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value,
      validationSchema: blockValidationSchemas.org,
    },
  });
  const {
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
    values,
    errors,
  } = formik;

  const doesOrgExist = React.useCallback(
    (errorMessages: IFormikFormErrors<IOrgValues>) => {
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
    },
    []
  );

  const orgExistsMessage = React.useMemo(() => {
    if (formOnly) {
      return;
    }

    return doesOrgExist(errors as any);
  }, [errors, formOnly]);

  const renderedNameInput = React.useMemo(() => {
    console.log("name");
    const input = (
      <Input
        autoComplete="off"
        name="name"
        onBlur={handleBlur}
        onChange={(evt) => {
          handleChange(evt);
          formikChangedFieldsHelpers.addField("name");
        }}
        value={values.name}
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
              <Typography.Paragraph strong>{values.name}</Typography.Paragraph>
            );
          }}
          // controlsEventHandler={}
        />
      );
    }

    return (
      <Form.Item
        help={
          touched.name &&
          (!!orgExistsMessage ? (
            <OrgExistsMessage message={orgExistsMessage} />
          ) : (
            <FormError error={errors.name} />
          ))
        }
      >
        {formOnly ? input : editable}
      </Form.Item>
    );
  }, [
    errors.name,
    values.name,
    touched.name,
    handleBlur,
    handleChange,
    formikChangedFieldsHelpers,
    orgExistsMessage,
    formOnly,
  ]);

  const renderedColorInput = React.useMemo(() => {
    return (
      <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
        <ColorPicker
          value={value.color}
          disabled={isSubmitting}
          onChange={(val) => {
            setFieldValue("color", val);
            formikChangedFieldsHelpers.addField("color");
          }}
        />
      </StyledContainer>
    );
  }, [value.color, isSubmitting, setFieldValue, formikChangedFieldsHelpers]);

  const renderedDescriptionInput = React.useMemo(() => {
    const input = (
      <Input.TextArea
        autoSize={{ minRows: 2, maxRows: 8 }}
        autoComplete="off"
        name="description"
        onBlur={handleBlur}
        onChange={(evt) => {
          handleChange(evt);
          formikChangedFieldsHelpers.addField("description");
        }}
        value={values.description}
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
                {values.description || ""}
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
          touched.description && <FormError>{errors.description}</FormError>
        }
      >
        {formOnly ? input : editable}
      </Form.Item>
    );
  }, [
    errors.description,
    values.description,
    touched.description,
    handleBlur,
    handleChange,
    formOnly,
  ]);

  // TODO: how can we make the controls stick to the bottom when the content can scroll?
  // particularly for task form

  const cancelHandler = React.useCallback(() => {
    if (org) {
    }
  }, []);

  const renderedControls = React.useMemo(() => {
    if (!formikChangedFieldsHelpers.hasChanges()) {
      return null;
    }

    if (isSubmitting) {
      return <LoadingOutlined />;
    }

    return (
      <StyledContainer>
        <Button danger type="text" disabled={isSubmitting} onClick={onClose}>
          {org ? "Discard Changes" : "Cancel"}
        </Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {org ? "Save Changes" : "Create Org"}
        </Button>
      </StyledContainer>
    );
  }, [org, isSubmitting, onClose]);

  const renderedForm = React.useMemo(() => {
    return (
      <StyledForm onSubmit={handleSubmit}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {(errors as any).error && (
              <FormError error={(errors as any).error} />
            )}
            <StyledContainer>
              <StyledContainer s={{ flex: 1, marginRight: "16px" }}>
                {renderedNameInput}
              </StyledContainer>
              {renderedColorInput}
            </StyledContainer>
            {renderedDescriptionInput}
          </StyledContainer>
          {renderedControls}
        </StyledContainer>
      </StyledForm>
    );
  }, [
    renderedNameInput,
    renderedDescriptionInput,
    renderedControls,
    errors,
    handleSubmit,
  ]);

  return renderedForm;
};

export default React.memo(Org);
