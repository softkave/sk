import { Button, Form } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/types";
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

// TODO: Move to error messages file
const boardExistsErrorMessage = "Board with the same name exists";

export interface IBoardFormValues {
    customId: string;
    type: BlockType;
    name: string;
    color: string;
    description?: string;
}

export type BoardFormErrors = IFormikFormErrors<IBoardFormValues>;

export interface IBoardFormProps {
    parent: IBlock;
    value: IBoardFormValues;
    onClose: () => void;
    onSubmit: (values: IBoardFormValues) => void;

    board?: IBlock;
    isSubmitting?: boolean;
    errors?: BoardFormErrors;
}

const BoardForm: React.FC<IBoardFormProps> = (props) => {
    const {
        parent,
        board,
        isSubmitting,
        onClose,
        value,
        onSubmit,
        errors: externalErrors,
    } = props;

    const boardIds = parent.boards || [];
    const boards = useSelector<IAppState, IBlock[]>((state) =>
        BlockSelectors.getBlocks(state, boardIds)
    );

    const { formik, formikChangedFieldsHelpers, formikHelpers } =
        useFormHelpers({
            errors: externalErrors,
            formikProps: {
                onSubmit,
                initialValues: value,
                validationSchema: blockValidationSchemas.org,
            },
        });

    const getBoardExistsError = (name: string) => {
        if (name && name.length > 0) {
            name = name.toLowerCase();
            const existingBoard = boards.find(
                (proj) => proj.name?.toLowerCase() === name
            );

            if (existingBoard && existingBoard.customId !== value.customId) {
                return boardExistsErrorMessage;
            }
        }
    };

    const renderNameInput = () => {
        const { touched, values, errors } = formik;

        // TODO: can this be more efficient?
        const boardNameError = errors.name || getBoardExistsError(values.name);

        return (
            <Form.Item
                label="Board Name"
                help={touched.name && <FormError error={boardNameError} />}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <InputWithControls
                    bordered={false}
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
                label="Board Description"
                help={
                    touched.description && (
                        <FormError error={errors.description} />
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <InputWithControls
                    useTextArea
                    bordered={false}
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
                label="Board Color Avatar"
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

    const preSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { errors, values, handleSubmit } = formik;

        // TODO: can this be more efficient?
        const boardNameError = errors.name || getBoardExistsError(values.name);

        if (!boardNameError) {
            handleSubmit(event);
        } else {
            formik.setFieldTouched("name");
        }
    };

    const renderForm = () => {
        const { errors } = formik;
        const globalError = getFormError(errors);

        return (
            <StyledForm onSubmit={(evt) => preSubmit(evt)}>
                <StyledContainer s={formContentWrapperStyle}>
                    <StyledContainer s={formInputContentWrapperStyle}>
                        {/* <StyledContainer s={{ paddingBottom: "16px" }}>
                            <Button
                                style={{ cursor: "pointer" }}
                                onClick={onClose}
                                className="icon-btn"
                            >
                                <ArrowLeft />
                            </Button>
                        </StyledContainer> */}
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
