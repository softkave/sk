import { Button, Form } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { IBlock } from "../../models/block/block";
import { blockErrorMessages } from "../../models/block/blockErrorMessages";
import blockValidationSchemas from "../block/validation";
import ColorPicker from "../forms/ColorPicker";
import FormError from "../forms/FormError";
import { IFormikFormErrors } from "../forms/formik-utils";
import {
    formContentWrapperStyle,
    formInputContentWrapperStyle,
    StyledForm,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledContainer from "../styled/Container";
import InputWithControls from "../utilities/InputWithControls";
import OrgExistsMessage from "./OrgExistsMessage";

export interface IEditOrgFormValues {
    name: string;
    color: string;
    description?: string;
}

export type EditOrgFormErrors = IFormikFormErrors<IEditOrgFormValues>;

export interface IEditOrgProps {
    value: IEditOrgFormValues;
    onClose: () => void;
    onSubmit: (values: IEditOrgFormValues) => void;

    isSubmitting?: boolean;
    org?: IBlock;
    errors?: EditOrgFormErrors;
}

const EditOrgForm: React.FC<IEditOrgProps> = (props) => {
    const {
        isSubmitting,
        onClose,
        value,
        onSubmit,
        org,
        errors: externalErrors,
    } = props;

    const {
        formik,
        formikHelpers,
        formikChangedFieldsHelpers,
    } = useFormHelpers({
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

    const renderNameInput = () => {
        const orgExistsMessage = doesOrgExist(formik.errors as any);
        const content = (
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
                disabled={isSubmitting}
                inputOnly={!org}
                placeholder="Org name"
            />
        );

        return (
            <Form.Item
                label="Org Name"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
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
                {content}
            </Form.Item>
        );
    };

    const renderColorInput = () => {
        return (
            <Form.Item
                label="Org Color Avatar"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ width: "100%" }}
            >
                <ColorPicker
                    value={value.color}
                    disabled={isSubmitting}
                    onChange={(val) => {
                        formik.setFieldValue("color", val);
                        formikChangedFieldsHelpers.addField("color");
                    }}
                />
            </Form.Item>
        );
    };

    const renderDesc = () => {
        const content = (
            <InputWithControls
                useTextArea
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
                inputOnly={!org}
                placeholder="Org description"
            />
        );

        return (
            <Form.Item
                label="Org Description"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                help={
                    formik.touched.description && (
                        <FormError>{formik.errors.description}</FormError>
                    )
                }
            >
                {content}
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
        const { handleSubmit } = formik;
        const errors = (formik.errors as any) as EditOrgFormErrors;

        return (
            <StyledForm onSubmit={handleSubmit}>
                <StyledContainer s={formContentWrapperStyle}>
                    <StyledContainer s={formInputContentWrapperStyle}>
                        <StyledContainer s={{ paddingBottom: "16px" }}>
                            <Button
                                style={{ cursor: "pointer" }}
                                onClick={onClose}
                                className="icon-btn"
                            >
                                <ArrowLeft />
                            </Button>
                        </StyledContainer>
                        {errors.error && <FormError error={errors.error} />}
                        {renderNameInput()}
                        {renderDesc()}
                        {renderColorInput()}
                    </StyledContainer>
                    {renderControls()}
                </StyledContainer>
            </StyledForm>
        );
    };

    return renderForm();
};

export default React.memo(EditOrgForm);
