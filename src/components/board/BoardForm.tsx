import { Button, Form } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import {
  IBlockLabelInput,
  IBlockStatusInput,
  IBoard,
  IBoardStatusResolutionInput,
} from "../../models/board/types";
import blockValidationSchemas from "../block/validation";
import ColorPicker from "../forms/ColorPicker";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledContainer from "../styled/Container";
import InputWithControls from "../utilities/InputWithControls";

export interface IBoardFormValues {
  name: string;
  description?: string;
  color: string;
  parent: string;
  boardStatuses: IBlockStatusInput[];
  boardLabels: IBlockLabelInput[];
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

  const renderNameInput = () => {
    const { touched, errors } = formik;
    const boardNameError = errors.name;
    return (
      <Form.Item
        label="Board Name"
        help={touched.name && <FormError error={boardNameError} />}
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
          disabled={isSubmitting}
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
        help={touched.description && <FormError error={errors.description} />}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
      <StyledContainer>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!formikChangedFieldsHelpers.hasChanges()}
        >
          {getSubmitLabel()}
        </Button>
      </StyledContainer>
    );
  };

  const renderForm = () => {
    const { errors } = formik;
    const globalError = getFormError(errors);
    return (
      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {!hideBackBtn && (
              <StyledContainer s={{ paddingBottom: "16px" }}>
                <Button
                  style={{ cursor: "pointer" }}
                  onClick={onClose}
                  className="icon-btn"
                >
                  <ArrowLeft />
                </Button>
              </StyledContainer>
            )}
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderNameInput()}
            {renderDescriptionInput()}
            {renderColorInput()}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return renderForm();
};

export default React.memo(BoardForm);
