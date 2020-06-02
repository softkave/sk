import { Button, Form, Input, Typography } from "antd";
import { Formik, FormikProps } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/store";
import BlockParentSelection from "../block/BlockParentSelection";
import blockValidationSchemas from "../block/validation";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../form/FormStyledComponents";
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";

// TODO: Move to error messages file
const boardExistsErrorMessage = "Board with the same name exists";

export interface IBoardFormValues {
  customId: string;
  type: BlockType;
  name: string;
  description?: string;
  parent?: string;
}

type BoardFormFormikProps = FormikProps<IBoardFormValues>;
export type BoardFormErrors = IFormikFormErrors<IBoardFormValues>;

export interface IBoardFormProps {
  possibleParents: IBlock[];
  value: IBoardFormValues;
  onClose: () => void;
  onSubmit: (values: IBoardFormValues) => void;

  formOnly?: boolean;
  board?: IBlock;
  isSubmitting?: boolean;
  errors?: BoardFormErrors;
}

const BoardForm: React.FC<IBoardFormProps> = (props) => {
  const {
    formOnly,
    board,
    isSubmitting,
    possibleParents,
    onClose,
    value,
    onSubmit,
    errors: externalErrors,
  } = props;

  const immediateParentId = value.parent;
  const immediateParent = possibleParents.find(
    (parent) => parent.customId === immediateParentId
  );
  const boardIds = (immediateParent && immediateParent!.boards) || [];
  const boards = useSelector<IAppState, IBlock[]>((state) =>
    getBlocksAsArray(state, boardIds)
  );
  const blockToUpdate = useSelector<IAppState, IBlock | undefined>((state) =>
    getBlock(state, value.customId)
  );

  const formikRef = useInsertFormikErrors(externalErrors);

  const getBoardExistsError = (name: string) => {
    if (name && name.length > 0) {
      name = name.toLowerCase();
      const existingBoard = boards.find(
        (proj) => proj.name?.toLowerCase() === name
      );

      if (existingBoard && existingBoard.customId !== blockToUpdate?.customId) {
        return boardExistsErrorMessage;
      }
    }
  };

  const renderParentInput = (formikProps: BoardFormFormikProps) => {
    const { touched, errors, values, setFieldValue } = formikProps;

    return (
      <Form.Item
        label="Parent"
        help={touched.parent && <FormError error={errors.parent} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <BlockParentSelection
          value={values.parent}
          possibleParents={possibleParents}
          onChange={(val) => setFieldValue("parent", val)}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderNameInput = (formikProps: BoardFormFormikProps) => {
    const { touched, values, errors } = formikProps;

    // TODO: can this be more efficient?
    const boardNameError = errors.name || getBoardExistsError(values.name);

    return (
      <Form.Item
        required
        label="Board Name"
        help={touched.name && <FormError error={boardNameError} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {formOnly ? (
          <Input
            autoComplete="off"
            name="name"
            onBlur={formikProps.handleBlur}
            onChange={formikProps.handleChange}
            value={values.name}
            placeholder="Enter board name"
            disabled={isSubmitting}
            maxLength={blockConstants.maxNameLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formikProps.setFieldValue("name", val);
              },
            }}
          >
            {values.name}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const renderDescriptionInput = (formikProps: BoardFormFormikProps) => {
    const { touched, handleBlur, values, errors, handleChange } = formikProps;

    return (
      <Form.Item
        label="Description"
        help={touched.description && <FormError error={errors.description} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {formOnly ? (
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            name="description"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.description}
            placeholder="Enter board description"
            disabled={isSubmitting}
            maxLength={blockConstants.maxDescriptionLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formikProps.setFieldValue("description", val);
              },
            }}
          >
            {values.description || ""}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const preSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    formikProps: BoardFormFormikProps
  ) => {
    event.preventDefault();

    const { errors, values, handleSubmit } = formikProps;

    // TODO: can this be more efficient?
    const boardNameError = errors.name || getBoardExistsError(values.name);

    if (!boardNameError) {
      handleSubmit(event);
    }
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
        <StyledButton
          block
          danger
          type="primary"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Close
        </StyledButton>
        <Button block type="primary" htmlType="submit" loading={isSubmitting}>
          {getSubmitLabel()}
        </Button>
      </StyledContainer>
    );
  };

  const renderForm = (formikProps: BoardFormFormikProps) => {
    const { errors } = formikProps;
    const globalError = getGlobalError(errors);
    formikRef.current = formikProps;

    return (
      <StyledForm onSubmit={(evt) => preSubmit(evt, formikProps)}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderNameInput(formikProps)}
            {renderDescriptionInput(formikProps)}
            {renderParentInput(formikProps)}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return (
    <Formik
      initialValues={value}
      validationSchema={blockValidationSchemas.org}
      onSubmit={onSubmit}
    >
      {(formikProps) => renderForm(formikProps)}
    </Formik>
  );
};

export default React.memo(BoardForm);
