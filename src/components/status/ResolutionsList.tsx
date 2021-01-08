import { Button, Typography } from "antd";
import { FormikErrors } from "formik";
import { noop } from "lodash";
import React from "react";
import * as yup from "yup";
import { IBoardStatusResolutionInput } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { getNewId } from "../../utils/utils";
import { getFormikTouched, validateWithYupSchema } from "../forms/utils";
import useArray from "../hooks/useArray";
import useFormHelpers from "../hooks/useFormHelpers";
import { labelValidationSchemas } from "../label/validation";
import OrgsListHeader from "../org/OrgsListHeader";
import StyledContainer from "../styled/Container";
import Scrollbar from "../utilities/Scrollbar";
import ResolutionFormItem from "./ResolutionFormItem";

const StyledContainerAsForm = StyledContainer.withComponent("form");

export interface IResolutionsListProps {
    resolutionsList: IBoardStatusResolutionInput[];
    saveChanges: (
        resolutionsList: IBoardStatusResolutionInput[]
    ) => Promise<void>;

    errors?: FormikErrors<{ resolutionsList: IBoardStatusResolutionInput[] }>;
    isSubmitting?: boolean;
}

const ResolutionsList: React.FC<IResolutionsListProps> = (props) => {
    const { resolutionsList, saveChanges, errors, isSubmitting } = props;
    const editingResolutionsList = useArray<string>();
    const newResolutionsList = useArray<string>();

    const onSubmit = (values: {
        resolutionsList: IBoardStatusResolutionInput[];
    }) => {
        // TODO: should we alert the user before saving if they have editing items?
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
        resolution: IBoardStatusResolutionInput,
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
        initialValue?: IBoardStatusResolutionInput
    ) => {
        if (initialValue) {
            formik.setFieldValue(`resolutionsList.[${index}]`, initialValue);
            editingResolutionsList.remove(initialValue.customId);
        }
    };

    const onEdit = (id: string) => {
        editingResolutionsList.add(id);
    };

    const onChange = (
        index: number,
        data: Partial<IBoardStatusResolutionInput>
    ) => {
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
        resolution: IBoardStatusResolutionInput,
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
                {resolutions}
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
        const resolution: IBoardStatusResolutionInput = {
            name: "",
            description: "",
            customId: getNewId(),
        };

        formikHelpers.addToArrayField("resolutionsList", resolution, {}, {});
        editingResolutionsList.add(resolution.customId);
        newResolutionsList.add(resolution.customId);
    }, [editingResolutionsList, newResolutionsList, formikHelpers]);

    const renderAddControls = () => {
        return (
            <OrgsListHeader
                noSearchBtn
                onClickCreate={onAddNewResolution}
                onSearchTextChange={noop}
                title="Resolutions"
                style={{ padding: "16px", paddingTop: 0 }}
                disabled={
                    isSubmitting ||
                    formik.values.resolutionsList.length >=
                        blockConstants.maxAvailableLabels
                }
            />
        );
    };

    const renderMain = () => {
        return (
            <StyledContainerAsForm
                s={{ width: "100%", height: "100%", flexDirection: "column" }}
                onSubmit={(e) => {
                    formik.handleSubmit(e);
                }}
            >
                <Scrollbar>
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
                </Scrollbar>
            </StyledContainerAsForm>
        );
    };

    return renderMain();
};

ResolutionsList.defaultProps = {
    resolutionsList: [],
};

export default React.memo(ResolutionsList);
