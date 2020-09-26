import { Button, Space, Typography } from "antd";
import { FormikErrors } from "formik";
import React from "react";
import { Plus } from "react-feather";
import * as yup from "yup";
import { IBoardTaskResolution } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { getDateString, getNewId } from "../../utils/utils";
import { getFormikTouched, validateWithYupSchema } from "../form/utils";
import useArray from "../hooks/useArray";
import useFormHelpers from "../hooks/useFormHelpers";
import { labelValidationSchemas } from "../label/validation";
import StyledContainer from "../styled/Container";
import DeviceScrollbar from "../utilities/DeviceScrollbar";
import ResolutionFormItem from "./ResolutionFormItem";

const StyledContainerAsForm = StyledContainer.withComponent("form");

export interface IResolutionsListProps {
    user: IUser;
    resolutionsList: IBoardTaskResolution[];
    saveChanges: (resolutionsList: IBoardTaskResolution[]) => Promise<void>;

    errors?: FormikErrors<{ resolutionsList: IBoardTaskResolution[] }>;
    isSubmitting?: boolean;
}

const ResolutionsList: React.FC<IResolutionsListProps> = (props) => {
    const { resolutionsList, saveChanges, user, errors, isSubmitting } = props;
    const editingResolutionsList = useArray<string>();
    const newResolutionsList = useArray<string>();

    const onSubmit = (values: { resolutionsList: IBoardTaskResolution[] }) => {
        // TODO: should we alert the user before saving if they have editing items?
        console.log("holla!");
        editingResolutionsList.reset();
        saveChanges(values.resolutionsList);
    };

    // TODO: form still shows error that come from server when submitting
    // should it even be allowed to submit, considering there is an error?
    const { formik, formikHelpers } = useFormHelpers({
        errors,
        formikProps: {
            initialValues: { resolutionsList },
            onSubmit,
            validationSchema: yup.object().shape({
                resolutionsList: labelValidationSchemas.labelList,
            }),
            validateOnBlur: true,
            validateOnChange: true,
        },
    });

    React.useEffect(() => {
        const processErrors = () => {
            if (errors && errors.resolutionsList) {
                const newEditingList: string[] = [];

                (errors.resolutionsList as any).forEach((e, i) => {
                    if (e) {
                        const resolution = formik.values.resolutionsList[i];

                        if (
                            !editingResolutionsList.exists(resolution.customId)
                        ) {
                            newEditingList.push(resolution.customId);
                        }
                    }
                });

                if (newEditingList.length > 0) {
                    editingResolutionsList.setList(newEditingList);
                }
            }
        };

        processErrors();
    }, [errors, formik.values.resolutionsList, editingResolutionsList]);

    const onCommitChanges = (
        resolution: IBoardTaskResolution,
        index: number
    ) => {
        const err = validateWithYupSchema(
            labelValidationSchemas.label,
            formik.values.resolutionsList[index]
        );

        if (err) {
            formik.setFieldTouched(
                `resolutionsList.[${index}]`,
                getFormikTouched(err) as any,
                true
            );

            formik.setFieldError(`resolutionsList.[${index}]`, err);
            return;
        }

        editingResolutionsList.remove(resolution.customId);
    };

    const onDiscardChanges = (
        index: number,
        initialValue?: IBoardTaskResolution
    ) => {
        if (initialValue) {
            formik.setFieldValue(`resolutionsList.[${index}]`, initialValue);
            editingResolutionsList.remove(initialValue.customId);
        }
    };

    const onEdit = (id: string) => {
        editingResolutionsList.add(id);
    };

    const onChange = (index: number, data: Partial<IBoardTaskResolution>) => {
        const changedFields = Object.keys(data);

        const nameField = `resolutionsList.[${index}].name`;
        const descField = `resolutionsList.[${index}].description`;

        if (changedFields.includes("name")) {
            formik.setFieldValue(nameField, data.name, true);
        }

        if (changedFields.includes("description")) {
            formik.setFieldValue(descField, data.description, true);
        }
    };

    const handleBlur = (index: number, field: string) => {
        const fullField = `resolutionsList.[${index}].${field}`;
        formik.handleBlur(fullField);
    };

    const getInitialValue = (id: string) => {
        return formik.initialValues.resolutionsList.find(
            (status) => status.customId === id
        );
    };

    const onDelete = React.useCallback(
        (index: number) => {
            const resolution = formik.values.resolutionsList[index];
            formikHelpers.deleteInArrayField("resolutionsList", index);
            editingResolutionsList.remove(resolution.customId);
        },
        [editingResolutionsList, formik.values.resolutionsList, formikHelpers]
    );

    const renderResolutionItem = (
        resolution: IBoardTaskResolution,
        index: number
    ) => {
        const isEditing = editingResolutionsList.exists(resolution.customId);
        const touched = (formik.touched.resolutionsList || [])[index];
        const resolutionErrors: any =
            (formik.errors.resolutionsList || [])[index] || {};
        const initialValue = getInitialValue(resolution.customId);

        return (
            <ResolutionFormItem
                key={resolution.customId}
                onChange={(data) => {
                    onChange(index, data);
                }}
                onCommitChanges={() => onCommitChanges(resolution, index)}
                onDelete={() => onDelete(index)}
                onDiscardChanges={() => onDiscardChanges(index, initialValue)}
                onEdit={() => onEdit(resolution.customId)}
                value={resolution}
                disabled={isSubmitting}
                errors={resolutionErrors}
                handleBlur={(field) => handleBlur(index, field)}
                isEditing={isEditing}
                isNew={newResolutionsList.exists(resolution.customId)}
                touched={touched}
                style={{
                    borderBottom:
                        index < formik.values.resolutionsList.length - 1
                            ? "1px solid #f0f0f0"
                            : undefined,
                }}
            />
        );
    };

    const renderList = () => {
        const resolutions = formik.values.resolutionsList.map(
            (resolution, index) => {
                return renderResolutionItem(resolution, index);
            }
        );

        return (
            <StyledContainer
                style={{
                    flexDirection: "column",
                    width: "100%",
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                <DeviceScrollbar>{resolutions}</DeviceScrollbar>
            </StyledContainer>
        );
    };

    const renderSubmitControls = () => {
        return (
            <StyledContainer
                s={{
                    flexDirection: "column",
                    width: "100%",
                    padding: "16px",
                }}
            >
                <Button loading={isSubmitting} type="primary" htmlType="submit">
                    Save Changes
                </Button>
            </StyledContainer>
        );
    };

    const onAddNewResolution = React.useCallback(() => {
        const resolution: IBoardTaskResolution = {
            name: "",
            description: "",
            createdAt: getDateString(),
            createdBy: user.customId,
            customId: getNewId(),
        };

        formikHelpers.addToArrayField("resolutionsList", resolution, {}, {});
        editingResolutionsList.add(resolution.customId);
        newResolutionsList.add(resolution.customId);
    }, [editingResolutionsList, newResolutionsList, user, formikHelpers]);

    const renderAddControls = () => {
        return (
            <StyledContainer s={{ padding: "16px" }}>
                <Button
                    disabled={
                        isSubmitting ||
                        formik.values.resolutionsList.length >=
                            blockConstants.maxAvailableLabels
                    }
                    onClick={() => onAddNewResolution()}
                    className="icon-btn"
                    style={{ padding: "2px 6px", paddingRight: "8px" }}
                >
                    <Space>
                        <Plus />
                        New Resolution
                    </Space>
                </Button>
            </StyledContainer>
        );
    };

    const renderMain = () => {
        return (
            <StyledContainerAsForm
                s={{ width: "100%", height: "100%", flexDirection: "column" }}
                // onSubmit={formik.handleSubmit}
                onSubmit={(e) => {
                    // e.preventDefault()
                    console.log("jo!");
                    formik.handleSubmit(e);
                }}
            >
                {renderAddControls()}
                <Typography.Paragraph
                    type="secondary"
                    style={{ padding: "0 16px" }}
                >
                    Resolutions describe the state of a completed task, like
                    "won't do" or in the case of a tech product, "deployed"
                    meaning the task/feature has been deployed.
                </Typography.Paragraph>
                {renderList()}
                {renderSubmitControls()}
            </StyledContainerAsForm>
        );
    };

    return renderMain();
};

ResolutionsList.defaultProps = {
    resolutionsList: [],
};

export default React.memo(ResolutionsList);
