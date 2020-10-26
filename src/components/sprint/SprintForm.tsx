import { Button, Form, Select } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import * as yup from "yup";
import { ISprint, SprintDuration } from "../../models/sprint/types";
import { indexArray } from "../../utils/utils";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import {
    formContentWrapperStyle,
    formInputContentWrapperStyle,
    StyledForm,
} from "../form/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledContainer from "../styled/Container";
import InputWithControls from "../utilities/InputWithControls";
import sprintValidationSchemas from "./utils";

// TODO: Move to error messages file
const SPRINT_EXISTS_MESSAGE = "A sprint with the same name exists";

export interface ISprintFormValues {
    name: string;
    duration: SprintDuration;
}

export type ISprintFormErrors = IFormikFormErrors<ISprintFormValues>;

export interface ISprintFormProps {
    value: ISprintFormValues;
    existingSprints: ISprint[];
    onClose: () => void;
    onSubmit: (values: ISprintFormValues) => void;
    sprint?: ISprint;
    isSubmitting?: boolean;
    errors?: ISprintFormErrors;
}

const sprintFormValidationSchema = yup.object().shape({
    name: sprintValidationSchemas.name.required(),
    duration: yup.string().required(),
});

const SprintForm: React.FC<ISprintFormProps> = (props) => {
    const {
        value,
        existingSprints,
        isSubmitting,
        sprint,
        onClose,
        onSubmit,
        errors: externalErrors,
    } = props;

    const existingSprintsMap = React.useMemo(() => {
        return indexArray(existingSprints, {
            path: "name",
            indexer: (data) => data.name?.toLowerCase(),
        });
    }, [existingSprints]);

    const {
        formik,
        formikChangedFieldsHelpers,
        formikHelpers,
    } = useFormHelpers({
        errors: externalErrors,
        formikProps: {
            onSubmit,
            initialValues: value || {},
            validationSchema: sprintFormValidationSchema,
        },
    });

    const getSprintExistsError = (name: string) => {
        if (name && name.length > 0) {
            name = name.toLowerCase();
            const existingSprint = existingSprintsMap[name];

            if (existingSprint) {
                if (sprint && sprint.customId === existingSprint.customId) {
                    return;
                }

                return SPRINT_EXISTS_MESSAGE;
            }
        }
    };

    const renderNameInput = () => {
        const sprintNameError =
            formik.errors.name || getSprintExistsError(formik.values.name);

        return (
            <Form.Item
                label="Sprint Name"
                help={
                    formik.touched.name && <FormError error={sprintNameError} />
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
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
                    noEditable={!sprint}
                    placeholder="Sprint name"
                />
            </Form.Item>
        );
    };

    const renderDurationInput = () => {
        return (
            <Form.Item
                label="Sprint Duration"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Select
                    defaultValue={formik.values.duration}
                    onChange={(val) => {
                        formik.setFieldValue("duration", val);
                        formikChangedFieldsHelpers.addField("duration");
                    }}
                    placeholder="Choose duration"
                    disabled={isSubmitting}
                >
                    <Select.Option value={SprintDuration.ONE_WEEK}>
                        {SprintDuration.ONE_WEEK}
                    </Select.Option>
                    <Select.Option value={SprintDuration.TWO_WEEKS}>
                        {SprintDuration.TWO_WEEKS}
                    </Select.Option>
                    <Select.Option value={SprintDuration.ONE_MONTH}>
                        {SprintDuration.ONE_MONTH}
                    </Select.Option>
                </Select>
            </Form.Item>
        );
    };

    const getSubmitLabel = () => {
        if (isSubmitting) {
            if (sprint) {
                return "Saving Changes";
            } else {
                return "Adding Sprint";
            }
        } else {
            if (sprint) {
                return "Save Changes";
            } else {
                return "Add Sprint";
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
                    disabled={
                        sprint
                            ? !formikChangedFieldsHelpers.hasChanges()
                            : false
                    }
                >
                    {getSubmitLabel()}
                </Button>
            </StyledContainer>
        );
    };

    const preSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { errors, values, handleSubmit } = formik;

        // TODO: can this be more efficient?
        const sprintNameError =
            errors.name || getSprintExistsError(values.name);

        if (!sprintNameError) {
            handleSubmit(event);
        } else {
            formik.setFieldTouched("name");
        }
    };

    const renderForm = () => {
        const { errors } = formik;
        const globalError = getGlobalError(errors);

        return (
            <StyledForm onSubmit={(evt) => preSubmit(evt)}>
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
                        {globalError && (
                            <Form.Item>
                                <FormError error={globalError} />
                            </Form.Item>
                        )}
                        {renderNameInput()}
                        {renderDurationInput()}
                    </StyledContainer>
                    {renderControls()}
                </StyledContainer>
            </StyledForm>
        );
    };

    return renderForm();
};

export default React.memo(SprintForm);
