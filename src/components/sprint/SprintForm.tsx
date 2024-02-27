import { Button, Form, Select } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import * as yup from "yup";
import { ISprint, SprintDuration } from "../../models/sprint/types";
import { IFormikFormErrors, getFormError } from "../forms/formik-utils";
import useFormHelpers from "../hooks/useFormHelpers";
import InputWithControls from "../utils/InputWithControls";
import FormFieldError from "../utils/form/FormFieldError";
import { formContentWrapperStyle, formInputContentWrapperStyle } from "../utils/form/styles";
import sprintValidationSchemas from "./utils";

export interface ISprintFormValues {
  name: string;
  duration: SprintDuration;
}

export type ISprintFormErrors = IFormikFormErrors<ISprintFormValues>;

export interface ISprintFormProps {
  value: ISprintFormValues;
  existingSprints: ISprint[];
  onClose: () => void;
  onSubmit: (values: ISprintFormValues) => void;
  sprint?: ISprint;
  isSubmitting?: boolean;
  disabled?: boolean;
  errors?: ISprintFormErrors;
}

const sprintFormValidationSchema = yup.object().shape({
  name: sprintValidationSchemas.name.required(),
  duration: yup.string().trim().required(),
});

const SprintForm: React.FC<ISprintFormProps> = (props) => {
  const {
    value,
    isSubmitting,
    sprint,
    disabled,
    onClose,
    onSubmit,
    errors: externalErrors,
  } = props;

  const { formik, formikChangedFieldsHelpers, formikHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value || {},
      validationSchema: sprintFormValidationSchema,
    },
  });

  const renderNameInput = () => {
    const sprintNameError = formik.errors.name;

    return (
      <Form.Item
        label="Sprint Name"
        help={formik.touched.name && <FormFieldError error={sprintNameError} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <InputWithControls
          value={formik.values.name}
          onChange={(val) => {
            formik.setFieldValue("name", val);
            formikChangedFieldsHelpers.addField("name");
          }}
          revertChanges={() => {
            formikHelpers.revertChanges("name");
          }}
          autoComplete="off"
          disabled={disabled}
          inputOnly={!sprint}
          placeholder="Sprint name"
        />
      </Form.Item>
    );
  };

  const renderDurationInput = () => {
    return (
      <Form.Item label="Sprint Duration" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Select
          defaultValue={formik.values.duration}
          onChange={(val) => {
            formik.setFieldValue("duration", val);
            formikChangedFieldsHelpers.addField("duration");
          }}
          placeholder="Choose duration"
          disabled={disabled}
        >
          <Select.Option value={SprintDuration.OneWeek}>{SprintDuration.OneWeek}</Select.Option>
          <Select.Option value={SprintDuration.TwoWeeks}>{SprintDuration.TwoWeeks}</Select.Option>
          <Select.Option value={SprintDuration.OneMonth}>{SprintDuration.OneMonth}</Select.Option>
        </Select>
      </Form.Item>
    );
  };

  const getSubmitLabel = () => {
    if (isSubmitting) {
      if (sprint) {
        return "Saving Changes";
      } else {
        return "Adding Sprint";
      }
    } else {
      if (sprint) {
        return "Save Changes";
      } else {
        return "Add Sprint";
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
          disabled={(sprint ? !formikChangedFieldsHelpers.hasChanges() : false) || disabled}
        >
          {getSubmitLabel()}
        </Button>
      </div>
    );
  };

  const preSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { errors, handleSubmit } = formik;
    const sprintNameError = errors.name;

    if (!sprintNameError) {
      handleSubmit(event);
    } else {
      formik.setFieldTouched("name");
    }
  };

  const renderForm = () => {
    const { errors } = formik;
    const globalError = getFormError(errors);

    return (
      <form onSubmit={(evt) => preSubmit(evt)}>
        <div style={formContentWrapperStyle}>
          <div style={formInputContentWrapperStyle}>
            <div style={{ paddingBottom: "16px" }}>
              <Button style={{ cursor: "pointer" }} onClick={onClose} className="icon-btn">
                <ArrowLeft />
              </Button>
            </div>
            {globalError && (
              <Form.Item>
                <FormFieldError error={globalError} />
              </Form.Item>
            )}
            {renderNameInput()}
            {renderDurationInput()}
          </div>
          {renderControls()}
        </div>
      </form>
    );
  };

  return renderForm();
};

export default React.memo(SprintForm);
