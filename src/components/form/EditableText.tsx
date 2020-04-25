import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Formik, FormikProps } from "formik";
import React from "react";
import StyledContainer from "../styled/Container";
import FormError from "./FormError";

export interface IEditableTextProps {
  type: "input" | "textarea";
  onSubmit: (text: string) => void;

  text?: string;
  yupSchema?: any;
  formItemProps?: React.ComponentProps<typeof Form.Item>;
  editingFormItemProps?: React.ComponentProps<typeof Form.Item>;
  regularFormItemProps?: React.ComponentProps<typeof Form.Item>;
  inputProps?: React.ComponentProps<typeof Input>;
  textAreaProps?: React.ComponentProps<typeof Input.TextArea>;
}

type StatusFormFormikProps = FormikProps<string>;

const EditableText: React.FC<IEditableTextProps> = (props) => {
  const {
    onSubmit,
    text,
    type,
    yupSchema,
    formItemProps,
    editingFormItemProps,
    regularFormItemProps,
    inputProps,
    textAreaProps,
  } = props;
  const [isEditing, setIsEditing] = React.useState(false);
  const editingStateFormItemProps = editingFormItemProps
    ? editingFormItemProps
    : formItemProps;
  const regularStateFormItemProps = regularFormItemProps
    ? regularFormItemProps
    : formItemProps;

  const toggleEditing = () => setIsEditing(false);

  const renderInput = (formikProps: StatusFormFormikProps) => {
    return (
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        {...editingStateFormItemProps}
        help={
          formikProps.touched && <FormError>{formikProps.errors}</FormError>
        }
      >
        <Input
          autoComplete="off"
          {...inputProps}
          onBlur={formikProps.handleBlur}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            formikProps.setValues(value);
          }}
          value={formikProps.values}
        />
      </Form.Item>
    );
  };

  const renderTextArea = (formikProps: StatusFormFormikProps) => {
    return (
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        {...editingStateFormItemProps}
        help={
          formikProps.touched && <FormError>{formikProps.errors}</FormError>
        }
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          {...textAreaProps}
          onBlur={formikProps.handleBlur}
          onChange={formikProps.handleChange}
          value={formikProps.values}
        />
      </Form.Item>
    );
  };

  const renderSubmitControls = () => {
    return (
      <StyledContainer>
        <Button
          type="danger"
          onClick={toggleEditing}
          icon={<CloseOutlined />}
        ></Button>
        <Button
          type="primary"
          htmlType="submit"
          icon={<CheckOutlined />}
        ></Button>
      </StyledContainer>
    );
  };

  const renderEditingView = () => {
    return (
      <Formik
        initialValues={text || ""}
        onSubmit={onSubmit}
        validationSchema={yupSchema}
      >
        {(formikProps) => {
          return (
            <form onSubmit={formikProps.handleSubmit}>
              <StyledContainer>
                {type === "input"
                  ? renderInput(formikProps)
                  : renderTextArea(formikProps)}
                {renderSubmitControls()}
              </StyledContainer>
            </form>
          );
        }}
      </Formik>
    );
  };

  const renderRegularView = () => {
    return (
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        {...regularStateFormItemProps}
      >
        <span>{text}</span>
      </Form.Item>
    );
  };

  return isEditing ? renderEditingView() : renderRegularView();
};

export default React.memo(EditableText);
