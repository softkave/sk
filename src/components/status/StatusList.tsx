import { Button, Divider, Typography } from "antd";
import { noop } from "lodash";
import randomColor from "randomcolor";
import React from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import * as yup from "yup";
import { IBlockStatusInput } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { getNewId } from "../../utils/utils";
import { IFormikFormErrors } from "../forms/formik-utils";
import { formClasses } from "../forms/FormStyledComponents";
import { getFormikTouched, validateWithYupSchema } from "../forms/utils";
import useArray from "../hooks/useArray";
import useFormHelpers from "../hooks/useFormHelpers";
import { labelValidationSchemas } from "../label/validation";
import ListHeader from "../utilities/ListHeader";
import Scrollbar from "../utilities/Scrollbar";
import StatusFormItem from "./StatusFormItem";

export interface IStatusListProps {
  statusList: IBlockStatusInput[];
  saveChanges: (statusList: IBlockStatusInput[]) => Promise<void>;
  errors?: IFormikFormErrors<{ statusList: IBlockStatusInput[] }>;
  isSubmitting?: boolean;
}

export const sortStatuses = (statusList: IBlockStatusInput[]) => {
  return [...statusList].sort(
    (item01, item02) => item01.position - item02.position
  );
};

const StatusList: React.FC<IStatusListProps> = (props) => {
  const { statusList, saveChanges, errors, isSubmitting } = props;
  const editingStatusList = useArray<string>();
  const newStatusList = useArray<string>();
  const onSubmit = React.useCallback(
    (values: { statusList: IBlockStatusInput[] }) => {
      // TODO: should we alert the user before saving if they have editing statuses?
      editingStatusList.reset();
      saveChanges(values.statusList);
    },
    [saveChanges, editingStatusList]
  );

  const { formik, formikHelpers } = useFormHelpers({
    errors,
    formikProps: {
      onSubmit,
      initialValues: { statusList },
      validationSchema: yup.object().shape({
        statusList: labelValidationSchemas.labelList,
      }),
      validateOnBlur: true,
      validateOnChange: true,
    },
  });

  React.useEffect(() => {
    const processErrors = () => {
      if (errors && errors.statusList) {
        const newEditingList: string[] = [];
        (errors.statusList as any).forEach((e, i) => {
          if (e) {
            const status = formik.values.statusList[i];

            if (!editingStatusList.exists(status.customId)) {
              newEditingList.push(status.customId);
            }
          }
        });

        if (newEditingList.length > 0) {
          editingStatusList.setList(newEditingList);
        }
      }
    };

    processErrors();
  }, [errors, formik.values.statusList, editingStatusList]);

  const onDelete = (index: number) => {
    const status = formik.values.statusList[index];
    formikHelpers.deleteInArrayField("statusList", index);
    editingStatusList.remove(status.customId);
    newStatusList.remove(status.customId);
  };

  const onCommitChanges = (status: IBlockStatusInput, index: number) => {
    const err = validateWithYupSchema(
      labelValidationSchemas.label,
      formik.values.statusList[index]
    );

    if (err) {
      formik.setFieldTouched(
        `statusList.[${index}]`,
        getFormikTouched(err) as any,
        true
      );

      formik.setFieldError(`statusList.[${index}]`, err);
      return;
    }

    editingStatusList.remove(status.customId);
  };

  const onDiscardChanges = (
    index: number,
    initialValue?: IBlockStatusInput
  ) => {
    if (initialValue) {
      formik.setFieldValue(`statusList.[${index}]`, initialValue);
      editingStatusList.remove(initialValue.customId);
    }
  };

  const onEdit = (id: string) => {
    editingStatusList.add(id);
  };

  const onChange = (index: number, data: Partial<IBlockStatusInput>) => {
    const nameField = `statusList.[${index}].name`;
    const descField = `statusList.[${index}].description`;
    const colorField = `statusList.[${index}].color`;
    const changedFields = Object.keys(data);

    if (changedFields.includes("name")) {
      formik.setFieldValue(nameField, data.name, true);
    }

    if (changedFields.includes("description")) {
      formik.setFieldValue(descField, data.description, true);
    }

    if (changedFields.includes("color")) {
      formik.setFieldValue(colorField, data.color, true);
    }
  };

  const handleBlur = (index: number, field: string) => {
    const fullField = `statusList.[${index}].${field}`;
    formik.handleBlur(fullField);
  };

  const getInitialValue = (id: string) => {
    return formik.initialValues.statusList.find(
      (status) => status.customId === id
    );
  };

  const changePostion = (srcIndex: number, destIndex: number) => {
    let statuses = [...formik.values.statusList];
    const s0 = statuses.splice(srcIndex, 1)[0];

    if (!s0) {
      return;
    }

    statuses = statuses
      .slice(0, destIndex)
      .concat(s0, statuses.slice(destIndex))
      .map((item, i) => ({
        ...item,
        position: i,
      }));

    formik.setFieldValue("statusList", statuses);
  };

  const onChangePosition = (index: number, up: boolean, max: number) => {
    const newIndex = up ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= max) {
      return;
    }

    changePostion(index, newIndex);
  };

  const renderStatusItem = (
    status: IBlockStatusInput,
    index: number,
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => {
    const isEditing = editingStatusList.exists(status.customId);
    const touched = (formik.touched.statusList || [])[index];
    const statusErrors: any = (formik.errors.statusList || [])[index];
    const statuses = formik.values.statusList;
    const values = statuses[index];
    const initialValue = getInitialValue(status.customId);

    return (
      <StatusFormItem
        canMoveUp={index > 0}
        canMoveDown={index < statusList.length - 1}
        onChange={(data) => onChange(index, data)}
        onChangePosition={(up) => onChangePosition(index, up, statuses.length)}
        onCommitChanges={() => onCommitChanges(status, index)}
        onDelete={() => onDelete(index)}
        onDiscardChanges={() => onDiscardChanges(index, initialValue)}
        onEdit={() => onEdit(status.customId)}
        provided={provided}
        snapshot={snapshot}
        value={values}
        disabled={isSubmitting}
        errors={statusErrors}
        handleBlur={(field, evt) => handleBlur(index, field)}
        isEditing={isEditing}
        isNew={newStatusList.exists(status.customId)}
        touched={touched}
        // style={{
        //   borderBottom:
        //     index < formik.values.statusList.length - 1
        //       ? "1px solid #f0f0f0"
        //       : undefined,
        // }}
      />
    );
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return;
    }

    // did not move anywhere - can bail early
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }

    const srcIndex = result.source.index;
    const destIndex = result.destination.index;
    changePostion(srcIndex, destIndex);
  };

  const renderList = () => {
    const sortedStatuses = [...formik.values.statusList].sort(
      (item01, item02) => item01.position - item02.position
    );

    const nodes: React.ReactNode[] = Array(sortedStatuses.length);
    sortedStatuses.forEach((status, index) => {
      nodes[status.position] = (
        <React.Fragment key={status.customId}>
          <Draggable
            draggableId={status.customId}
            index={status.position}
            isDragDisabled={isSubmitting}
          >
            {(provided, snapshot) =>
              renderStatusItem(status, index, provided, snapshot)
            }
          </Draggable>
          <Divider />
        </React.Fragment>
      );
    });

    return (
      <DragDropContext
        onDragEnd={(result, provided) => onDragEnd(result, provided)}
      >
        <Droppable
          droppableId="status-list"
          type="status"
          isDropDisabled={isSubmitting}
        >
          {(provided, snapshot) => {
            return (
              <div
                ref={provided.innerRef}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
                {...provided.droppableProps}
              >
                {nodes}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    );
  };

  const renderSubmitControls = () => {
    // TODO: disable when there aren't changes
    return (
      <div
        style={{
          flexDirection: "column",
          width: "100%",
          padding: "24px 16px 24px 16px",
        }}
      >
        <Button
          block
          loading={isSubmitting}
          type="primary"
          onClick={() => {
            formik.submitForm();
          }}
        >
          {isSubmitting ? "Saving Changes" : "Save Changes"}
        </Button>
      </div>
    );
  };

  const onAddNewStatus = () => {
    const status: IBlockStatusInput = {
      name: "",
      description: "",
      color: randomColor(),
      customId: getNewId(),
      position: formik.values.statusList.length,
    };

    formikHelpers.addToArrayField("statusList", status, { name: "" }, {});
    editingStatusList.add(status.customId);
    newStatusList.add(status.customId);
  };

  const renderAddControls = () => {
    return (
      <ListHeader
        hideSearchButton
        onCreate={onAddNewStatus}
        onSearchTextChange={noop}
        title="Status"
        style={{ padding: "16px", paddingTop: "8px", paddingRight: "14px" }}
        disabled={
          isSubmitting ||
          formik.values.statusList.length >= blockConstants.maxAvailableLabels
        }
      />
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className={formClasses.form}>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gridTemplateColumns: "1fr",
          overflow: "hidden",
        }}
      >
        {renderAddControls()}
        <Scrollbar>
          {renderList()}
          <Typography.Paragraph
            type="secondary"
            style={{ padding: "0px 16px" }}
          >
            You can add resolutions in the{" "}
            <Typography.Text strong>Resolutions</Typography.Text> tab.
            Resolutions describe the state of a completed task, like{" "}
            <Typography.Text strong>"won't do"</Typography.Text>, and{" "}
            <Typography.Text strong>"done"</Typography.Text>.
          </Typography.Paragraph>
          {renderSubmitControls()}
        </Scrollbar>
      </div>
    </form>
  );
};

StatusList.defaultProps = {
  statusList: [],
};

export default React.memo(StatusList);
