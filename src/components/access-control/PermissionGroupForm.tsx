import { css } from "@emotion/css";
import { Button, Form, Input, List, Select } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import {
    IPermissionGroup,
    IPermissionGroupInput,
} from "../../models/access-control/types";
import { ICollaborator } from "../../models/user/user";
import CollaboratorThumbnail from "../collaborator/CollaboratorThumbnail";
import FormError from "../forms/FormError";
import { IFormikFormErrors } from "../forms/formik-utils";
import {
    formContentWrapperStyle,
    formInputContentWrapperStyle,
    StyledForm,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledContainer from "../styled/Container";
import PermissionGroupUser from "./PermissionGroupUser";
import { permissionGroupValidationSchemas } from "./validation";

export type PermissionGroupFormErrors = IFormikFormErrors<IPermissionGroupInput>;

export interface IPermissionGroupFormProps {
    value: IPermissionGroupInput;
    existingGroups: IPermissionGroup[];
    collaborators: ICollaborator[];
    collaboratorsMap: Record<string, ICollaborator>;
    onClose: () => void;
    onSubmit: (values: IPermissionGroupInput) => void;
    isSubmitting?: boolean;
    permissionGroup?: IPermissionGroup;
    errors?: PermissionGroupFormErrors;
}

const kPermissionGroupExists = "Permission group exists";

const PermissionGroupForm: React.FC<IPermissionGroupFormProps> = (props) => {
    const {
        isSubmitting,
        onClose,
        value,
        onSubmit,
        permissionGroup,
        existingGroups,
        collaborators,
        collaboratorsMap,
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
            validationSchema: permissionGroupValidationSchemas.permissionGroup,
        },
    });

    const getGroupExistsError = (name: string) => {
        if (name && name.length > 0) {
            name = name.toLowerCase();
            const existingGroup = existingGroups.find(
                (group) => group.name?.toLowerCase() === name
            );

            if (
                permissionGroup &&
                existingGroup &&
                existingGroup.customId === permissionGroup.customId
            ) {
                return;
            }

            return kPermissionGroupExists;
        }
    };

    const renderNameInput = () => {
        // TODO: can this be more efficient?
        const nameError =
            formik.errors.name || getGroupExistsError(formik.values.name);

        return (
            <Form.Item
                label="Group Name"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                help={formik.touched.name && <FormError error={nameError} />}
                style={{ width: "100%" }}
            >
                <Input
                    value={formik.values.name}
                    onChange={(val) => {
                        formik.setFieldValue("name", val);
                        formikChangedFieldsHelpers.addField("name");
                    }}
                    autoComplete="off"
                    disabled={isSubmitting}
                    placeholder="Permission group name"
                />
            </Form.Item>
        );
    };

    const renderDesc = () => {
        return (
            <Form.Item
                label="Description"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                help={
                    formik.touched.description && (
                        <FormError>{formik.errors.description}</FormError>
                    )
                }
            >
                <Input.TextArea
                    value={formik.values.description}
                    onChange={(val) => {
                        formik.setFieldValue("description", val);
                        formikChangedFieldsHelpers.addField("description");
                    }}
                    autoComplete="off"
                    disabled={isSubmitting}
                    placeholder="Description"
                />
            </Form.Item>
        );
    };

    const removeUser = (userId: string, assignees: string[] = []) => {
        const index = assignees.indexOf(userId);

        if (index !== -1) {
            const updated = [...assignees];
            updated.splice(index, 1);
            return updated;
        }

        return assignees;
    };

    const addUser = (collaborator: ICollaborator, assignees: string[] = []) => {
        const exists = !!assignees.find((next) => {
            return collaborator.customId === next;
        });

        if (!exists) {
            return [...assignees, collaborator.customId];
        }

        return assignees;
    };

    const renderPermissionGroupUser = (userId: string) => (
        <List.Item>
            <PermissionGroupUser
                key={userId}
                collaborator={collaboratorsMap[userId]}
                onRemove={() => {
                    formik.setFieldValue(
                        "users",
                        removeUser(userId, formik.values.users)
                    );

                    formikChangedFieldsHelpers.addField("users");
                }}
                disabled={isSubmitting}
            />
        </List.Item>
    );

    const renderUserList = () => {
        if (!Array.isArray(formik.values.users)) {
            return null;
        }

        if (formik.values.users.length === 0) {
            return "Not assigned to anybody yet";
        }

        return (
            <List
                dataSource={formik.values.users}
                renderItem={renderPermissionGroupUser}
            />
        );
    };

    const renderUsersInput = () => {
        return (
            <Form.Item
                label="Users"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Select
                    placeholder="Select user"
                    value={undefined}
                    onChange={(index) => {
                        formik.setFieldValue(
                            "users",
                            addUser(
                                collaborators[Number(index)],
                                formik.values.users
                            )
                        );
                        formikChangedFieldsHelpers.addField("users");
                    }}
                    disabled={isSubmitting}
                    optionLabelProp="label"
                >
                    {collaborators.map((collaborator, index) => {
                        return (
                            <Select.Option
                                value={index}
                                key={collaborator.customId}
                                label={collaborator.name}
                            >
                                <CollaboratorThumbnail
                                    collaborator={collaborator}
                                />
                            </Select.Option>
                        );
                    })}
                </Select>
                <div className={css({ marginBottom: "16px" })}>
                    {renderUserList()}
                </div>
            </Form.Item>
        );
    };

    const getSubmitLabel = () => {
        if (isSubmitting) {
            if (permissionGroup) {
                return "Saving Changes";
            } else {
                return "Creating Permission Group";
            }
        } else {
            if (permissionGroup) {
                return "Save Changes";
            } else {
                return "Create Permission Group";
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
        const errors = (formik.errors as any) as PermissionGroupFormErrors;

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
                    </StyledContainer>
                    {renderControls()}
                </StyledContainer>
            </StyledForm>
        );
    };

    return renderForm();
};

export default React.memo(PermissionGroupForm);
