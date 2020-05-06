import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { Formik, FormikErrors } from "formik";
import randomColor from "randomcolor";
import React from "react";
import { Check, X as CloseIcon } from "react-feather";
import * as yup from "yup";
import { IBlockLabel } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { newId } from "../../utils/utils";
import ColorPicker from "../form/ColorPicker";
import FormError from "../form/FormError";
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";
import { labelValidationSchemas } from "../label/validation";
import StyledContainer from "../styled/Container";
import RoundEdgeTags from "../utilities/RoundEdgeTags";
import { LabelListFormikProps } from "./types";

const StyledContainerAsForm = StyledContainer.withComponent("form");

export interface ILabelListProps {
  user: IUser;
  labelList: IBlockLabel[];
  saveChanges: (labelList: IBlockLabel[]) => Promise<void>;

  errors?: FormikErrors<IBlockLabel[]>;
  isSubmitting?: boolean;
}

const LabelList: React.FC<ILabelListProps> = (props) => {
  const { labelList, saveChanges, user, errors, isSubmitting } = props;
  const [editingLabel, setEditingLabel] = React.useState<string[]>([]);
  const [newLabels, setNewLabels] = React.useState<string[]>([]);

  const formikRef = useInsertFormikErrors(errors);

  const onDelete = React.useCallback(
    (formikProps: LabelListFormikProps, index: number) => {
      const newLabelList = [...formikProps.values.labelList];
      const label = newLabelList[index];
      const labelListTouched = [
        ...Array.from(formikProps.touched?.labelList || []),
      ];

      const labelListErrors = [
        ...Array.from((formikProps.errors?.labelList as any[]) || []),
      ];

      newLabelList.splice(index, 1);
      labelListTouched.splice(index, 1);
      labelListErrors.splice(index, 1);

      formikProps.setTouched({ labelList: labelListTouched });
      formikProps.setErrors({ labelList: labelListErrors });
      formikProps.setFieldValue("labelList", newLabelList);

      if (editingLabel.indexOf(label.customId) !== -1) {
        const newEditingLabels = [...editingLabel];
        newEditingLabels.splice(editingLabel.indexOf(label.customId), 1);
        setEditingLabel(newEditingLabels);
      }

      if (newLabels.indexOf(label.customId) >= 0) {
        const newNewLabel = [...newLabels];
        newNewLabel.splice(newNewLabel.indexOf(label.customId), 1);
        setNewLabels(newNewLabel);
      }
    },
    [editingLabel, newLabels]
  );

  // const checkNameConflicts = (
  //   formikProps: LabelListFormikProps,
  //   labelIndex?: number
  // ) => {
  //   const nameToLabelMap = indexArray(formikProps.values.labelList, {
  //     path: "name",
  //     indexer: (label: IBlockLabel) => label.name.toLowerCase(),
  //     proccessValue: (label: IBlockLabel, u1, u2, index: number) => {
  //       return {
  //         label,
  //         index,
  //       };
  //     },
  //   });

  //   const checkErrors: LabelListFormikErrors = { labelList: [] };

  //   const pushError = (label: IBlockLabel, index: number) => {
  //     const existingError: any =
  //       (formikProps.errors.labelList || [])[index] || {};

  //     if (existingError.name) {
  //       // @ts-ignore
  //       checkErrors.labelList.push(existingError);
  //       return;
  //     }

  //     const labelDataWithNameConflict =
  //       nameToLabelMap[label.name.toLowerCase()];

  //     if (
  //       labelDataWithNameConflict &&
  //       labelDataWithNameConflict.index !== index
  //     ) {
  //       // @ts-ignore
  //       checkErrors.labelList.push({
  //         ...existingError,
  //         name: "Label name exists",
  //       });
  //     } else if (existingError) {
  //       // @ts-ignore
  //       checkErrors.labelList.push(existingError);
  //     }
  //   };

  //   if (isNumber(labelIndex) && labelIndex >= 0) {
  //     pushError(formikProps.values.labelList[labelIndex], labelIndex);
  //   } else {
  //     formikProps.values.labelList.forEach((label, index) => {
  //       pushError(label, index);
  //     });
  //   }

  //   return checkErrors;
  // };

  const renderEditingLabel = (
    formikProps: LabelListFormikProps,
    index: number
  ) => {
    const touched = (formikProps.touched.labelList || [])[index];
    const labelErrors: any = (formikProps.errors.labelList || [])[index] || {};
    const values = formikProps.values.labelList[index];
    const nameField = `labelList.[${index}].name`;
    const descField = `labelList.[${index}].description`;

    return (
      <StyledContainer>
        <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            help={
              touched?.name &&
              labelErrors.name && <FormError>{labelErrors.name}</FormError>
            }
            style={{
              marginBottom: "4px",
            }}
          >
            <Input
              autoComplete="off"
              onBlur={formikProps.handleBlur}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                formikProps.setFieldValue(nameField, value);
              }}
              name={nameField}
              value={values.name}
              placeholder="Enter label name"
              disabled={isSubmitting}
            />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            help={
              touched?.description &&
              labelErrors.description && (
                <FormError>{labelErrors.description}</FormError>
              )
            }
            style={{
              marginBottom: "0px",
            }}
          >
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              autoComplete="off"
              onBlur={formikProps.handleBlur}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                const value = event.target.value;
                formikProps.setFieldValue(descField, value);
              }}
              name={descField}
              value={values.description}
              placeholder="Enter label description"
              disabled={isSubmitting}
            />
          </Form.Item>
        </StyledContainer>
        {/* <ColorPicker
          value={values.color}
          onChange={(value) => formikProps.setFieldValue(colorField, value)}
        /> */}
      </StyledContainer>
    );
  };

  const renderRegularLabel = (
    formikProps: LabelListFormikProps,
    index: number
  ) => {
    const values = formikProps.values.labelList[index];
    return (
      <StyledContainer>
        <StyledContainer s={{ flexDirection: "column", flex: 1 }}>
          <StyledContainer
          // style={{
          //   color: "rgba(0,0,0,0.85)",
          // }}
          >
            <RoundEdgeTags
              // contentColor="white"
              color={values.color}
              children={values.name}
            />
            {/* {values.name} */}
          </StyledContainer>
          <StyledContainer s={{ marginTop: "4px" }}>
            {values.description}
          </StyledContainer>
        </StyledContainer>
        {/* <ColorPicker value={values.color} onChange={() => null} /> */}
      </StyledContainer>
    );
  };

  const renderLabelButtons = (
    formikProps: LabelListFormikProps,
    label: IBlockLabel,
    index: number,
    isEditing: boolean
  ) => {
    const validateField = () => {
      try {
        labelValidationSchemas.label.validateSync(
          formikProps.values.labelList[index],
          { abortEarly: false }
        );

        return false;
      } catch (e) {
        const err: any = {};

        if (Array.isArray(e.inner) && e.inner.length > 0) {
          e.inner.forEach((er) => {
            if (!err[er.path]) {
              err[er.path] = er.message;
            }
          });
        } else {
          err[e.path] = e.message;
        }

        return err;
      }
    };

    if (isEditing) {
      return (
        <React.Fragment>
          <Button
            icon={<Check />}
            onClick={() => {
              const e = validateField();

              if (e) {
                formikProps.setFieldTouched(`labelList.[${index}].name`, true);
                formikProps.setFieldTouched(
                  `labelList.[${index}].description`,
                  true
                );
                return;
              }

              const newEditingLabel = [...editingLabel];
              newEditingLabel.splice(editingLabel.indexOf(label.customId), 1);
              setEditingLabel(newEditingLabel);

              if (newLabels.indexOf(label.customId) >= 0) {
                const newNewLabel = [...newLabels];
                newNewLabel.splice(newNewLabel.indexOf(label.customId), 1);
                setNewLabels(newNewLabel);
              }
            }}
            disabled={isSubmitting}
          />
          <Button
            onClick={() => {
              const e = validateField();

              if (e) {
                formikProps.setFieldTouched(`labelList.[${index}].name`, true);
                formikProps.setFieldTouched(
                  `labelList.[${index}].description`,
                  true
                );
                return;
              }

              formikProps.setFieldValue(`labelList.[${index}]`, label);
              const newEditingLabels = [...editingLabel];
              newEditingLabels.splice(editingLabel.indexOf(label.customId), 1);
              setEditingLabel(newEditingLabels);

              if (newLabels.indexOf(label.customId) >= 0) {
                const newNewLabel = [...newLabels];
                newNewLabel.splice(newNewLabel.indexOf(label.customId), 1);
                setNewLabels(newNewLabel);
              }
            }}
            icon={<CloseIcon style={{ fontSize: "14px" }} />}
            disabled={isSubmitting || newLabels.indexOf(label.customId) !== -1}
          />
        </React.Fragment>
      );
    } else {
      return (
        <Button
          disabled={isSubmitting}
          icon={<EditOutlined />}
          onClick={() => {
            setEditingLabel([...editingLabel, label.customId]);
          }}
        />
      );
    }
  };

  const renderLabel = (
    formikProps: LabelListFormikProps,
    label: IBlockLabel,
    index: number
  ) => {
    const isEditing = editingLabel.indexOf(label.customId) >= 0;

    return (
      <StyledContainer
        key={label.customId}
        s={{
          alignItems: "flex-start",
          width: "100%",
          padding: "24px",
          // borderTop: index === 0 ? "1px solid #f0f0f0" : undefined,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <StyledContainer
          s={{ flexDirection: "column", flex: 1, marginRight: "16px" }}
        >
          {isEditing
            ? renderEditingLabel(formikProps, index)
            : renderRegularLabel(formikProps, index)}
        </StyledContainer>
        <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
          <ColorPicker
            value={formikProps.values.labelList[index].color}
            disabled={isSubmitting ? true : !isEditing}
            onChange={(value) =>
              formikProps.setFieldValue(`labelList.[${index}].color`, value)
            }
          />
          <StyledContainer
            s={{ flex: 1, alignItems: "flex-end", marginTop: "12px" }}
          >
            <Space>
              {renderLabelButtons(formikProps, label, index, isEditing)}
              <Button
                danger
                disabled={isSubmitting}
                icon={<DeleteOutlined />}
                onClick={() => onDelete(formikProps, index)}
              />
            </Space>
          </StyledContainer>
        </StyledContainer>
      </StyledContainer>
    );
  };

  const renderList = (formikProps: LabelListFormikProps) => {
    const labels = formikProps.values.labelList.map((label, index) => {
      return renderLabel(formikProps, label, index);
    });

    return (
      <StyledContainer
        style={{
          flexDirection: "column",
          width: "100%",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {labels}
      </StyledContainer>
    );
  };

  const renderSubmitControls = (formikProps: LabelListFormikProps) => {
    return (
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          padding: "24px",
        }}
      >
        <Button
          // disabled={isSubmitting}
          loading={isSubmitting}
          type="primary"
          htmlType="submit"
          onClick={(evt: React.MouseEvent<HTMLFormElement>) => {
            // TODO: should we do name checking?
            // const submitErrors: LabelListFormikErrors = checkNameConflicts(
            //   formikProps
            // );
            // if (submitErrors) {
            //   // TODO: navigate to the first error in the list
            //   evt.preventDefault();
            //   formikProps.setErrors(submitErrors);
            // }

            formikProps.setTouched({
              labelList: formikProps.values.labelList.map((label) => ({
                name: true,
                description: true,
              })),
            });
          }}
        >
          Save Changes
        </Button>
      </StyledContainer>
    );
  };

  const onAddNewLabel = React.useCallback(
    (formikProps: LabelListFormikProps) => {
      const label: IBlockLabel = {
        name: "",
        description: "",
        color: randomColor(),
        createdAt: Date.now(),
        createdBy: user.customId,
        customId: newId(),
      };

      const labelListTouched = [
        ...Array.from(formikProps.touched?.labelList || []),
      ];

      const labelListErrors = [
        ...Array.from((formikProps.errors?.labelList as any[]) || []),
      ];
      const newLabelList = [...formikProps.values.labelList];
      newLabelList.unshift(label);
      formikProps.setValues({ labelList: newLabelList });
      labelListTouched.unshift({});
      labelListErrors.unshift({});

      formikProps.setTouched({ labelList: labelListTouched });
      formikProps.setErrors({ labelList: labelListErrors });
      formikProps.setFieldValue("labelList", newLabelList);

      const newEditingLabels = [...editingLabel];
      newEditingLabels.push(label.customId);
      setEditingLabel(newEditingLabels);

      const newNewLabels = [...newLabels];
      newNewLabels.unshift(label.customId);
      setNewLabels(newNewLabels);
    },
    [editingLabel, newLabels, user]
  );

  const renderAddControls = (formikProps: LabelListFormikProps) => {
    return (
      <StyledContainer
        s={{ padding: "24px", borderBottom: "1px solid #f0f0f0" }}
      >
        <Button
          disabled={
            isSubmitting ||
            formikProps.values.labelList.length >=
              blockConstants.maxAvailableLabels
          }
          icon={<PlusOutlined />}
          onClick={() => onAddNewLabel(formikProps)}
        >
          New Label
        </Button>
      </StyledContainer>
    );
  };

  const renderMain = (formikProps: LabelListFormikProps) => {
    formikRef.current = formikProps;

    return (
      <StyledContainerAsForm
        s={{ width: "100%", height: "100%", flexDirection: "column" }}
        onSubmit={formikProps.handleSubmit}
      >
        {renderAddControls(formikProps)}
        {renderList(formikProps)}
        {renderSubmitControls(formikProps)}
      </StyledContainerAsForm>
    );
  };

  const onSubmit = (values: { labelList: IBlockLabel[] }) => {
    // TODO: should we alert the user they have unsaved changes?
    setEditingLabel([]);
    setNewLabels([]);

    saveChanges(values.labelList);
  };

  return (
    <Formik
      initialValues={{ labelList }}
      onSubmit={onSubmit}
      validationSchema={yup.object().shape({
        labelList: labelValidationSchemas.labelList,
      })}
    >
      {(formikProps) => renderMain(formikProps)}
    </Formik>
  );
};

LabelList.defaultProps = {
  labelList: [],
};

export default React.memo(LabelList);
