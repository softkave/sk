import { css } from "@emotion/css";
import { Button, Checkbox, Form } from "antd";
import React from "react";
import { IClient } from "../../models/user/user";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import { FormBody } from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";

export interface IUpdateClientFormData {
    muteChatNotifications: boolean;
}

export interface IUpdateClientFormProps {
    client: IClient;
    onSubmit: (values: IUpdateClientFormData) => void | Promise<void>;
    errors?: IFormikFormErrors<IUpdateClientFormData>;
    isSubmitting?: boolean;
}

const UpdateClientForm: React.FC<IUpdateClientFormProps> = (props) => {
    const { client, onSubmit, isSubmitting, errors: externalErrors } = props;

    const { formik } = useFormHelpers({
        errors: externalErrors,
        formikProps: {
            initialValues: {
                muteChatNotifications: client.muteChatNotifications,
            } as IUpdateClientFormData,
            onSubmit: (data) => {
                onSubmit({
                    muteChatNotifications: data.muteChatNotifications,
                });
            },
        },
    });

    const globalError = getFormError(formik.errors);

    const muteChatNotificationsNode = (
        <Form.Item
            help={
                formik.touched?.muteChatNotifications &&
                formik.errors?.muteChatNotifications && (
                    <FormError error={formik.errors.muteChatNotifications} />
                )
            }
        >
            <Checkbox
                value={formik.values.muteChatNotifications}
                onChange={(evt) => {
                    formik.setFieldValue(
                        "muteChatNotifications",
                        evt.target.value
                    );
                }}
            >
                Mute chat notifications for this browser
            </Checkbox>
        </Form.Item>
    );

    return (
        <FormBody>
            <form onSubmit={formik.handleSubmit}>
                {globalError && (
                    <Form.Item>
                        <FormError error={globalError} />
                    </Form.Item>
                )}
                {muteChatNotificationsNode}
                <Form.Item
                    className={css({
                        marginTop: "24px",
                    })}
                >
                    <Button
                        block
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                    >
                        {isSubmitting ? "Updating Settings" : "Update Settings"}
                    </Button>
                </Form.Item>
            </form>
        </FormBody>
    );
};

export default UpdateClientForm;
