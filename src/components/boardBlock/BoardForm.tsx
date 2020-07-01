import { Button, Form, Input, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import BlockSelectors from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/types";
import blockValidationSchemas from "../block/validation";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../form/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
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
    BlockSelectors.getBlocks(state, boardIds)
  );
  const blockToUpdate = useSelector<IAppState, IBlock | undefined>((state) =>
    BlockSelectors.getBlock(state, value.customId)
  );

  const { formik } = useFormHelpers({
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

      if (existingBoard && existingBoard.customId !== blockToUpdate?.customId) {
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
        required
        help={touched.name && <FormError error={boardNameError} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {formOnly ? (
          <Input
            autoComplete="off"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={values.name}
            placeholder="Board name"
            disabled={isSubmitting}
            maxLength={blockConstants.maxNameLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formik.setFieldValue("name", val);
              },
            }}
          >
            {values.name}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const renderDescriptionInput = () => {
    const { touched, handleBlur, values, errors, handleChange } = formik;

    return (
      <Form.Item
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
            placeholder="Board description"
            disabled={isSubmitting}
            maxLength={blockConstants.maxDescriptionLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formik.setFieldValue("description", val);
              },
            }}
          >
            {values.description || ""}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const preSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { errors, values, handleSubmit } = formik;

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

  const renderForm = () => {
    const { errors } = formik;
    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={(evt) => preSubmit(evt)}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderNameInput()}
            {renderDescriptionInput()}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return renderForm();
};

export default React.memo(BoardForm);
