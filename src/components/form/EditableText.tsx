import { Button, Form, Input, Space } from "antd";
import { Formik, FormikProps } from "formik";
import get from "lodash/get";
import set from "lodash/set";
import React from "react";
import { Check, X as CloseIcon } from "react-feather";
import StyledContainer from "../styled/Container";
import FormError from "./FormError";

type EditableTextFormikProps = FormikProps<any>;

export interface IEditableTextProps {
  type: "input" | "textarea";
  onSubmit: (text: string) => void;

  editing?: boolean;
  disabled?: boolean;

  text?: string;
  textStyle?: React.CSSProperties;
  yupSchema?: any;
  extraValidation?: (value: string) => void;

  formItemProps?: Partial<React.ComponentProps<typeof Form.Item>>;
  editingFormItemProps?: Partial<React.ComponentProps<typeof Form.Item>>;
  regularFormItemProps?: Partial<React.ComponentProps<typeof Form.Item>>;
  inputProps?: Partial<React.ComponentProps<typeof Input>>;
  textAreaProps?: Partial<React.ComponentProps<typeof Input.TextArea>>;

  formikProps?: EditableTextFormikProps;
  itemField?: string;
}

const EditableText: React.FC<IEditableTextProps> = (props) => {
  const {
    editing,
    disabled,
    onSubmit,
    text,
    type,
    yupSchema,
    formItemProps,
    editingFormItemProps,
    regularFormItemProps,
    inputProps,
    textAreaProps,
    extraValidation,
    textStyle,
  } = props;
  const [isEditing, setIsEditing] = React.useState(editing || false);
  const [initialValue] = React.useState(
    props.formikProps ? get(props.formikProps.values, props.itemField!) : text
  );
  const editingStateFormItemProps = editingFormItemProps
    ? editingFormItemProps
    : formItemProps;
  const regularStateFormItemProps = regularFormItemProps
    ? regularFormItemProps
    : formItemProps;

  const toggleEditing = () => setIsEditing(!isEditing);

  const renderInput = (formikProps: EditableTextFormikProps) => {
    console.log({
      errors: formikProps.errors,
      touched: get(formikProps.touched, props.itemField!),
    });

    const touched = get(formikProps.touched, props.itemField!);
    const error = get(formikProps.errors, props.itemField!);

    return (
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        {...editingStateFormItemProps}
        help={touched && error && <FormError>{error}</FormError>}
        style={{
          marginBottom: 0,
        }}
      >
        <Input
          autoComplete="off"
          {...inputProps}
          name={props.itemField!}
          onBlur={formikProps.handleBlur}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            formikProps.setFieldValue(props.itemField!, value);

            if (extraValidation) {
              extraValidation(value);
            }
          }}
          value={get(formikProps.values, props.itemField!)}
        />
      </Form.Item>
    );
  };

  const renderTextArea = (formikProps: EditableTextFormikProps) => {
    const touched = get(formikProps.touched, props.itemField!);
    const error = get(formikProps.errors, props.itemField!);

    return (
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        {...editingStateFormItemProps}
        help={touched && error && <FormError>{error}</FormError>}
        style={{
          marginBottom: 0,
        }}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          {...textAreaProps}
          name={props.itemField!}
          onBlur={formikProps.handleBlur}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value;
            formikProps.setFieldValue(props.itemField!, value);

            if (extraValidation) {
              extraValidation(value);
            }
          }}
          value={get(formikProps.values, props.itemField!)}
        />
      </Form.Item>
    );
  };

  const onCancel = (formikProps: EditableTextFormikProps) => {
    formikProps.setFieldValue(props.itemField!, initialValue);
    toggleEditing();
  };

  const renderSubmitControls = (formikProps: EditableTextFormikProps) => {
    return (
      <StyledContainer s={{ marginTop: "8px", justifyContent: "flex-end" }}>
        <Space>
          <Button
            onClick={() => onCancel(formikProps)}
            icon={<CloseIcon style={{ fontSize: "14px" }} />}
          ></Button>
          <Button
            htmlType="submit"
            icon={<Check />}
            onClick={() => {
              toggleEditing();
            }}
          ></Button>
        </Space>
      </StyledContainer>
    );
  };

  const renderForm = (formikProps: EditableTextFormikProps) => {
    return (
      <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
        {type === "input"
          ? renderInput(formikProps)
          : renderTextArea(formikProps)}
        {renderSubmitControls(formikProps)}
      </StyledContainer>
    );
  };

  const renderEditingView = () => {
    if (props.formikProps) {
      return renderForm(props.formikProps);
    } else {
      const initialValues = {};
      set(initialValues, props.itemField!, text || "");

      return (
        <Formik
          initialValues={initialValues as any}
          onSubmit={(values) => onSubmit(get(values, props.itemField!))}
          validationSchema={yupSchema}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              {renderForm(formikProps)}
            </form>
          )}
        </Formik>
      );
    }
  };

  const renderRegularView = () => {
    return (
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        {...regularStateFormItemProps}
        style={{
          marginBottom: 0,
        }}
      >
        <span
          style={textStyle}
          onClick={() => {
            if (!disabled) {
              toggleEditing();
            }
          }}
        >
          {props.formikProps
            ? get(props.formikProps.values, props.itemField!)
            : text}
        </span>
      </Form.Item>
    );
  };

  return (
    <StyledContainer
      s={{
        width: "100%",
        ["& .ant-form-item-control-input"]: {
          minHeight: "16px",
        },
      }}
    >
      {isEditing ? renderEditingView() : renderRegularView()}
    </StyledContainer>
  );
};

EditableText.defaultProps = {
  itemField: "text",
};

export default React.memo(EditableText);
