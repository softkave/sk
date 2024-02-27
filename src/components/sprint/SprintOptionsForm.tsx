import { Button, Form, Select } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import * as yup from "yup";
import { IBoardSprintOptions, SprintDuration } from "../../models/sprint/types";
import { IFormikFormErrors, getFormError } from "../forms/formik-utils";
import useFormHelpers from "../hooks/useFormHelpers";
import FormFieldError from "../utils/form/FormFieldError";
import { formContentWrapperStyle, formInputContentWrapperStyle } from "../utils/form/styles";

export interface ISprintOptionsFormValues {
  duration: SprintDuration;
}

export type ISprintOptionsFormErrors = IFormikFormErrors<ISprintOptionsFormValues>;

export interface ISprintOptionsFormProps {
  value: ISprintOptionsFormValues;
  onClose: () => void;
  onSubmit: (values: ISprintOptionsFormValues) => void;
  isSubmitting?: boolean;
  errors?: ISprintOptionsFormErrors;
  sprintOptions?: IBoardSprintOptions;
  disabled?: boolean;
}

const sprintOptionsFormValidationSchema = yup.object().shape({
  duration: yup.string().trim().required(),
});

const SprintOptionsForm: React.FC<ISprintOptionsFormProps> = (props) => {
  const {
    value,
    isSubmitting,
    sprintOptions,
    disabled,
    onClose,
    onSubmit,
    errors: externalErrors,
  } = props;

  const { formik, formikChangedFieldsHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value || {},
      validationSchema: sprintOptionsFormValidationSchema,
    },
  });

  const renderDurationInput = () => {
    return (
      <Form.Item label="Duration" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Select
          placeholder="Choose duration"
          defaultValue={formik.values.duration}
          onChange={(val) => {
            formik.setFieldValue("duration", val);
            formikChangedFieldsHelpers.addField("duration");
          }}
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
      if (sprintOptions) {
        return "Saving Changes";
      } else {
        return "Setting up Sprints";
      }
    } else {
      if (sprintOptions) {
        return "Save Changes";
      } else {
        return "Setup Sprints";
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
          disabled={!formikChangedFieldsHelpers.hasChanges() || disabled}
        >
          {getSubmitLabel()}
        </Button>
      </div>
    );
  };

  const renderForm = () => {
    const { errors } = formik;
    const globalError = getFormError(errors);

    return (
      <form onSubmit={formik.handleSubmit}>
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
            {renderDurationInput()}
          </div>
          {renderControls()}
        </div>
      </form>
    );
  };

  return renderForm();
};

export default React.memo(SprintOptionsForm);
