import { Button, Form, Select } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import * as yup from "yup";
import { IBoardSprintOptions, SprintDuration } from "../../models/sprint/types";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";

export interface ISprintOptionsFormValues {
  duration: SprintDuration;
}

export type ISprintOptionsFormErrors =
  IFormikFormErrors<ISprintOptionsFormValues>;

export interface ISprintOptionsFormProps {
  value: ISprintOptionsFormValues;
  onClose: () => void;
  onSubmit: (values: ISprintOptionsFormValues) => void;
  isSubmitting?: boolean;
  errors?: ISprintOptionsFormErrors;
  sprintOptions?: IBoardSprintOptions;
}

const sprintOptionsFormValidationSchema = yup.object().shape({
  duration: yup.string().trim().required(),
});

const SprintOptionsForm: React.FC<ISprintOptionsFormProps> = (props) => {
  const {
    value,
    isSubmitting,
    sprintOptions,
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
      <Form.Item
        label="Duration"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Select
          placeholder="Choose duration"
          defaultValue={formik.values.duration}
          onChange={(val) => {
            formik.setFieldValue("duration", val);
            formikChangedFieldsHelpers.addField("duration");
          }}
          disabled={isSubmitting}
        >
          <Select.Option value={SprintDuration.ONE_WEEK}>
            {SprintDuration.ONE_WEEK}
          </Select.Option>
          <Select.Option value={SprintDuration.TWO_WEEKS}>
            {SprintDuration.TWO_WEEKS}
          </Select.Option>
          <Select.Option value={SprintDuration.ONE_MONTH}>
            {SprintDuration.ONE_MONTH}
          </Select.Option>
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
          disabled={!formikChangedFieldsHelpers.hasChanges()}
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
              <Button
                style={{ cursor: "pointer" }}
                onClick={onClose}
                className="icon-btn"
              >
                <ArrowLeft />
              </Button>
            </div>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
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
