import { Button, Form } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import {
  IBoard,
  IBoardLabelInput,
  IBoardStatusInput,
  IBoardStatusResolutionInput,
} from "../../models/board/types";
import blockValidationSchemas from "../block/validation";
import { IFormikFormErrors, getFormError } from "../forms/formik-utils";
import useFormHelpers from "../hooks/useFormHelpers";
import InputWithControls from "../utils/InputWithControls";
import FormFieldError from "../utils/form/FormFieldError";
import ColorPicker from "../utils/form/inputs/ColorPicker";
import {
  formClassname,
  formContentWrapperStyle,
  formInputContentWrapperStyle,
} from "../utils/form/styles";

export interface IBoardFormValues {
  name: string;
  description?: string;
  color: string;
  workspaceId: string;
  boardStatuses: IBoardStatusInput[];
  boardLabels: IBoardLabelInput[];
  boardResolutions: IBoardStatusResolutionInput[];
}

export type BoardFormErrors = IFormikFormErrors<IBoardFormValues>;

export interface IBoardFormProps {
  value: IBoardFormValues;
  onClose: () => void;
  onSubmit: (values: IBoardFormValues) => void;
  board?: IBoard;
  isSubmitting?: boolean;
  errors?: BoardFormErrors;
  hideBackBtn?: boolean;
}

const BoardForm: React.FC<IBoardFormProps> = (props) => {
  const {
    board,
    isSubmitting,
    value,
    hideBackBtn,
    onSubmit,
    onClose,
    errors: externalErrors,
  } = props;

  const { formik, formikChangedFieldsHelpers, formikHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value,
      validationSchema: blockValidationSchemas.org,
    },
  });

  const formDisabled = isSubmitting;

  const renderNameInput = () => {
    const { touched, errors } = formik;
    const boardNameError = errors.name;
    return (
      <Form.Item
        label="Board Name"
        help={touched.name && <FormFieldError error={boardNameError} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <InputWithControls
          // bordered={false}
          value={formik.values.name}
          onChange={(val) => {
            formik.setFieldValue("name", val);
            formikChangedFieldsHelpers.addField("name");
          }}
          revertChanges={() => {
            formikHelpers.revertChanges("name");
          }}
          autoComplete="off"
          disabled={formDisabled}
          inputOnly={!board}
          placeholder="Board name"
        />
      </Form.Item>
    );
  };

  const renderDescriptionInput = () => {
    const { touched, errors } = formik;

    return (
      <Form.Item
        label="Description"
        help={touched.description && <FormFieldError error={errors.description} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <InputWithControls
          useTextArea
          // bordered={false}
          value={formik.values.description}
          onChange={(val) => {
            formik.setFieldValue("description", val);
            formikChangedFieldsHelpers.addField("description");
          }}
          revertChanges={() => {
            formikHelpers.revertChanges("description");
          }}
          autoComplete="off"
          disabled={formDisabled}
          inputOnly={!board}
          placeholder="Board description"
        />
      </Form.Item>
    );
  };

  const renderColorInput = () => {
    return (
      <Form.Item
        label="Color Avatar"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ width: "100%" }}
      >
        <ColorPicker
          value={formik.values.color}
          disabled={formDisabled}
          onChange={(val) => {
            formik.setFieldValue("color", val);
            formikChangedFieldsHelpers.addField("color");
          }}
        />
      </Form.Item>
    );
  };

  const getSubmitLabel = () => {
    if (isSubmitting) {
      if (board) {
        return "Saving Changes";
      } else {
        return "Creating Board";
      }
    } else {
      if (board) {
        return "Save Changes";
      } else {
        return "Create Board";
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
          disabled={!formikChangedFieldsHelpers.hasChanges() || formDisabled}
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
      <form onSubmit={formik.handleSubmit} className={formClassname}>
        <div style={formContentWrapperStyle}>
          <div style={formInputContentWrapperStyle}>
            {!hideBackBtn && (
              <div style={{ paddingBottom: "16px" }}>
                <Button style={{ cursor: "pointer" }} onClick={onClose} className="icon-btn">
                  <ArrowLeft />
                </Button>
              </div>
            )}
            {globalError && (
              <Form.Item>
                <FormFieldError error={globalError} />
              </Form.Item>
            )}
            {renderNameInput()}
            {renderDescriptionInput()}
            {renderColorInput()}
          </div>
          {renderControls()}
        </div>
      </form>
    );
  };

  return renderForm();
};

export default React.memo(BoardForm);
