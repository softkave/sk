import { Button, Form, Input, Space } from "antd";
import isBoolean from "lodash/isBoolean";
import isString from "lodash/isString";
import moment from "moment";
import React from "react";
import { ArrowLeft, Plus } from "react-feather";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import ErrorMessages from "../../models/errorMessages";
import { notificationConstants } from "../../models/notification/constants";
import { INotification } from "../../models/notification/notification";
import { notificationErrorMessages } from "../../models/notification/notificationErrorMessages";
import { IUser } from "../../models/user/user";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import { getErrorMessageWithMax } from "../../models/validationErrorMessages";
import { getNewId } from "../../utils/utils";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
    formContentWrapperStyle,
    formInputContentWrapperStyle,
    StyledForm,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledContainer from "../styled/Container";
import AddCollaboratorFormItem, {
    IAddCollaboratorFormItemValues,
} from "./AddCollaboratorFormItem";
import ExpiresAt from "./ExpiresAt";

const emailExistsErrorMessage = "Email addresss has been entered already";

const requestSchema = yup.object().shape({
    email: yup
        .string()
        .email(userErrorMessages.invalidEmail)
        .required(ErrorMessages.EMAIL_ADDRESS_IS_REQUIRED), // TODO: Central place for error messages
    body: yup
        .string()
        .max(notificationConstants.maxAddCollaboratorMessageLength, () => {
            return getErrorMessageWithMax(
                notificationConstants.maxAddCollaboratorMessageLength,
                "string"
            );
        }),
    expiresAt: yup.number(),
});

const validationSchema = yup.object().shape({
    message: yup
        .string()
        .max(notificationConstants.maxAddCollaboratorMessageLength),
    expiresAt: yup.number(),
    collaborators: yup
        .array()
        .of(requestSchema)
        .min(blockConstants.minAddCollaboratorValuesLength)
        .max(blockConstants.maxAddCollaboratorValuesLength)
        .required(),
});

// TODO: Test not allowing action on an expired collaboration request
export interface IAddCollaboratorFormValues {
    message?: string;
    expiresAt?: number;
    collaborators: IAddCollaboratorFormItemValues[];
}

export type AddCollaboratorFormErrors = IFormikFormErrors<
    IAddCollaboratorFormValues
>;

export interface IAddCollaboratorFormProps {
    existingCollaborators: IUser[];
    existingCollaborationRequests: INotification[];
    value: IAddCollaboratorFormValues;
    onClose: () => void;
    onSubmit: (values: IAddCollaboratorFormValues) => void;

    isSubmitting?: boolean;
    errors?: AddCollaboratorFormErrors;
}

const AddCollaboratorForm: React.FC<IAddCollaboratorFormProps> = (props) => {
    const {
        existingCollaborators,
        existingCollaborationRequests,
        value,
        onClose,
        onSubmit,
        isSubmitting,
        errors: externalErrors,
    } = props;

    const getEmailConflict = (email: string, itemIndex: number) => {
        const collaborators = formik.values.collaborators;
        email = email.toLowerCase();

        let exists =
            collaborators.findIndex((req, i) => {
                if (i === itemIndex) {
                    return false;
                }

                return req.email.toLowerCase() === email;
            }) !== -1;

        if (exists) {
            return emailExistsErrorMessage;
        }

        exists =
            existingCollaborators.findIndex(
                (user) => user.email.toLowerCase() === email
            ) !== -1;

        if (exists) {
            return notificationErrorMessages.sendingRequestToAnExistingCollaborator;
        }

        exists =
            existingCollaborationRequests.findIndex(
                (req) => req.to.email.toLowerCase() === email
            ) !== -1;

        if (exists) {
            return notificationErrorMessages.requestHasBeenSentBefore;
        }
    };

    const internalOnSubmit = (values: IAddCollaboratorFormValues) => {
        // TODO: handle confict errors this way for now, and put them with validation
        // using the validation schema in the validate function as formik prop
        let hasError = false;
        const errs = formik.values.collaborators.map((req, i) => {
            const emailConflictError = getEmailConflict(req.email, i);

            if (emailConflictError) {
                hasError = true;
                return { email: emailConflictError };
            }

            return undefined;
        });

        if (hasError) {
            formik.setFieldError("collaborators", errs as any);
            return;
        }

        onSubmit({
            expiresAt: values.expiresAt,
            message: values.message,
            collaborators: values.collaborators.map((collaborator) => ({
                email: collaborator.email,
                body: collaborator.body,
                expiresAt: collaborator.expiresAt,
            })),
        });
    };

    const {
        formik,
        formikHelpers,
        formikChangedFieldsHelpers,
    } = useFormHelpers({
        errors: externalErrors,
        formikProps: {
            initialValues: value,
            onSubmit: internalOnSubmit,
            validationSchema,
        },
    });

    const renderDefaultMessageInput = () => {
        const { touched, errors, values, handleBlur } = formik;

        return (
            <Form.Item
                label="Default Message"
                help={touched.message && <FormError error={errors.message} />}
                extra="This message is added to every request without a message"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    autoComplete="off"
                    name="message"
                    value={values.message}
                    onChange={(evt) => {
                        formik.setFieldValue("message", evt.target.value);
                        formikChangedFieldsHelpers.addField("message");
                    }}
                    onBlur={handleBlur}
                    placeholder="Enter default message"
                    disabled={isSubmitting}
                />
            </Form.Item>
        );
    };

    const renderDefaultExpirationInput = () => {
        const { touched, errors, values, setFieldValue } = formik;

        return (
            <Form.Item
                label="Default Expiration Date"
                help={
                    touched.expiresAt && <FormError error={errors.expiresAt} />
                }
                extra="This date is added to every request without one"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <ExpiresAt
                    minDate={moment().subtract(1, "day").endOf("day")}
                    onChange={(val) => {
                        setFieldValue("expiresAt", val);
                        formikChangedFieldsHelpers.addField("expiresAt");
                    }}
                    value={values.expiresAt}
                    placeholder="Select default expiration date"
                    disabled={isSubmitting}
                    style={{ width: "100%" }}
                />
            </Form.Item>
        );
    };

    const onDelete = (index: number) => {
        formikHelpers.deleteInArrayField("collaborators", index);
        formikChangedFieldsHelpers.addField("collaborators");
    };

    const onChange = (
        index: number,
        data: Partial<IAddCollaboratorFormItemValues>
    ) => {
        const emailPath = `collaborators.[${index}].email`;
        const bodyPath = `collaborators.[${index}].body`;
        const expiresAtPath = `collaborators.[${index}].expiresAt`;
        const changedFields = Object.keys(data);

        if (changedFields.includes("email")) {
            formik.setFieldValue(emailPath, data.email);
        }

        if (changedFields.includes("body")) {
            formik.setFieldValue(bodyPath, data.body);
        }

        if (changedFields.includes("expiresAt")) {
            formik.setFieldValue(expiresAtPath, data.expiresAt);
        }

        formikChangedFieldsHelpers.addField("collaborators");
    };

    const onAddNewStatus = () => {
        const status: IAddCollaboratorFormItemValues & { customId: string } = {
            email: "",
            body: "",
            customId: getNewId(),
        };

        formikHelpers.addToArrayField("collaborators", status, {}, {});
        formikChangedFieldsHelpers.addField("collaborators");
    };

    const renderAddControls = () => {
        return (
            <StyledContainer>
                <Button
                    disabled={
                        isSubmitting ||
                        formik.values.collaborators.length >=
                            blockConstants.maxAddCollaboratorValuesLength
                    }
                    onClick={() => onAddNewStatus()}
                    htmlType="button"
                    className="icon-btn"
                    style={{ padding: "2px 6px", paddingRight: "8px" }}
                >
                    <Space>
                        <Plus />
                        Add Request
                    </Space>
                </Button>
            </StyledContainer>
        );
    };

    const renderCollaboratorsListInput = () => {
        const { touched, errors, values } = formik;

        return (
            <Form.Item
                label="Requests"
                help={
                    isBoolean(touched.collaborators) &&
                    isString(errors.collaborators) && (
                        <FormError>{errors.collaborators}</FormError>
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                {renderAddControls()}
                {values.collaborators.map((collaborator, i) => {
                    return (
                        <AddCollaboratorFormItem
                            onChange={(val) => onChange(i, val)}
                            onDelete={() => onDelete(i)}
                            value={collaborator}
                            disabled={isSubmitting}
                            errors={(errors.collaborators || [])[i] as any}
                            key={(collaborator as any).customId}
                            touched={(touched.collaborators || [])[i]}
                            style={{
                                borderBottom:
                                    i < formik.values.collaborators.length - 1
                                        ? "1px solid #f0f0f0"
                                        : undefined,
                            }}
                        />
                    );
                })}
            </Form.Item>
        );
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
                    Send Requests
                </Button>
            </StyledContainer>
        );
    };

    const renderForm = () => {
        const { errors, handleSubmit } = formik;
        const globalError = getFormError(errors);

        return (
            <StyledForm onSubmit={handleSubmit}>
                <StyledContainer s={formContentWrapperStyle}>
                    <StyledContainer s={formInputContentWrapperStyle}>
                        <StyledContainer>
                            <Button
                                style={{ cursor: "pointer" }}
                                onClick={onClose}
                                className="icon-btn"
                            >
                                <ArrowLeft />
                            </Button>
                        </StyledContainer>
                        {globalError && (
                            <Form.Item>
                                <FormError error={globalError} />
                            </Form.Item>
                        )}
                        {renderDefaultMessageInput()}
                        {renderDefaultExpirationInput()}
                        {renderCollaboratorsListInput()}
                    </StyledContainer>
                    {renderControls()}
                </StyledContainer>
            </StyledForm>
        );
    };

    return renderForm();
};

export default React.memo(AddCollaboratorForm);
