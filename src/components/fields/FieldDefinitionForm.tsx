import { Button, Checkbox, Form, Select } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import {
  feedbackFieldsList,
  IFeedbackField,
  IFieldInput,
} from "../../models/fields/fields";
import FormError from "../forms/FormError";
import { IFormikFormErrors } from "../forms/formik-utils";
import {
  formClassname,
  formContentWrapperStyle,
  formInputContentWrapperStyle,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import InputWithControls from "../utilities/InputWithControls";
import { fieldValidationSchemas } from "./validation";

export type FieldDefinitionFormErrors = IFormikFormErrors<IFieldInput>;

export interface IFieldDefinitionFormProps {
  value: IFieldInput;
  existingFields: IFeedbackField[];
  onClose: () => void;
  onSubmit: (values: IFieldInput) => void;
  isSubmitting?: boolean;
  field?: IFeedbackField;
  errors?: FieldDefinitionFormErrors;
}

const kFieldNameExists = "Field name exists";
const kFieldProgrammaticIdExists = "Field programmatic id exists";

const FieldDefinitionForm: React.FC<IFieldDefinitionFormProps> = (props) => {
  const {
    isSubmitting,
    onClose,
    value,
    onSubmit,
    field,
    existingFields,
    errors: externalErrors,
  } = props;

  const { formik, formikHelpers, formikChangedFieldsHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value,
      validationSchema: fieldValidationSchemas.field,
    },
  });

  const getNameExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();
      const found = existingFields.find(
        (field) => field.name?.toLowerCase() === name
      );

      if (field && found && found.customId === field.customId) {
        return;
      }

      return kFieldNameExists;
    }
  };

  const getProgrammaticIdExistsError = (pid: string) => {
    if (pid && pid.length > 0) {
      pid = pid.toLowerCase();
      const found = existingFields.find(
        (field) => field.programmaticId?.toLowerCase() === pid
      );

      if (field && found && found.customId === field.customId) {
        return;
      }

      return kFieldProgrammaticIdExists;
    }
  };

  const renderNameInput = () => {
    // TODO: can this be more efficient?
    const nameError =
      formik.errors.name || getNameExistsError(formik.values.name || "");

    return (
      <Form.Item
        label="Field Name"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={formik.touched.name && <FormError error={nameError} />}
        style={{ width: "100%" }}
      >
        <InputWithControls
          hideControls
          revertChanges={() => {
            formikHelpers.revertChanges("name");
          }}
          inputOnly={!field}
          value={formik.values.name}
          onChange={(val) => {
            formik.setFieldValue("name", val);
            formikChangedFieldsHelpers.addField("name");
          }}
          autoComplete="off"
          disabled={isSubmitting}
          placeholder="Enter field name"
          bordered={false}
        />
      </Form.Item>
    );
  };

  const renderProgrammaticIdInput = () => {
    // TODO: can this be more efficient?
    const idError =
      formik.errors.programmaticId ||
      getProgrammaticIdExistsError(formik.values.programmaticId || "");

    return (
      <Form.Item
        label="Programmatic Id"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={formik.touched.programmaticId && <FormError error={idError} />}
        style={{ width: "100%" }}
      >
        <InputWithControls
          hideControls
          revertChanges={() => {
            formikHelpers.revertChanges("programmaticId");
          }}
          inputOnly={!field}
          value={formik.values.programmaticId}
          onChange={(val) => {
            formik.setFieldValue("programmaticId", val);
            formikChangedFieldsHelpers.addField("programmaticId");
          }}
          autoComplete="off"
          disabled={isSubmitting}
          placeholder="Enter programmatic id"
          bordered={false}
        />
      </Form.Item>
    );
  };

  const renderDescInput = () => {
    return (
      <Form.Item
        label="Description"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={
          formik.touched.description && (
            <FormError>{formik.errors.description}</FormError>
          )
        }
      >
        <InputWithControls
          hideControls
          revertChanges={() => {
            formikHelpers.revertChanges("description");
          }}
          inputOnly={!field}
          autoComplete="off"
          bordered={false}
          value={formik.values.description}
          onChange={(val) => {
            formik.setFieldValue("description", val);
            formikChangedFieldsHelpers.addField("description");
          }}
          disabled={isSubmitting}
          placeholder="Description"
        />
      </Form.Item>
    );
  };

  const renderTypeInput = () => {
    return (
      <Form.Item
        label="Type"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        help={
          formik.touched.type && <FormError>{formik.errors.type}</FormError>
        }
      >
        <Select
          value={formik.values.type}
          onChange={(val) => {
            formik.setFieldValue("type", val);
            formikChangedFieldsHelpers.addField("type");
          }}
          placeholder="Select field type"
          disabled={isSubmitting}
        >
          {feedbackFieldsList.map((field) => (
            <Select.Option key={field} value={field}>
              {field}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  const renderRequiredInput = () => {
    return (
      <Form.Item
        // label="Required"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Checkbox
          value={formik.values.required}
          onChange={(val) => {
            formik.setFieldValue("required", val);
            formikChangedFieldsHelpers.addField("required");
          }}
          disabled={isSubmitting}
        >
          Field is required
        </Checkbox>
      </Form.Item>
    );
  };

  const getSubmitLabel = () => {
    if (isSubmitting) {
      if (field) {
        return "Saving Changes";
      } else {
        return "Creating Field";
      }
    } else {
      if (field) {
        return "Save Changes";
      } else {
        return "Create Field";
      }
    }
  };

  const renderControls = () => {
    return (
      <div>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!formikChangedFieldsHelpers.hasChanges()}
        >
          {getSubmitLabel()}
        </Button>
      </div>
    );
  };

  const renderForm = () => {
    const { handleSubmit } = formik;
    const errors = formik.errors as any as FieldDefinitionFormErrors;

    return (
      <form onSubmit={handleSubmit} className={formClassname}>
        <div style={formContentWrapperStyle}>
          <div style={formInputContentWrapperStyle}>
            <div style={{ paddingBottom: "16px" }}>
              <Button
                style={{ cursor: "pointer" }}
                onClick={onClose}
                className="icon-btn"
              >
                <ArrowLeft />
              </Button>
            </div>
            {errors.error && <FormError error={errors.error} />}
            {renderNameInput()}
            {renderDescInput()}
            {renderProgrammaticIdInput()}
            {renderRequiredInput()}
            {renderTypeInput()}
          </div>
          {renderControls()}
        </div>
      </form>
    );
  };

  return renderForm();
};

export default React.memo(FieldDefinitionForm);
