import {
  CloseCircleTwoTone,
  DeleteFilled,
  EditOutlined,
  EditTwoTone,
  SaveTwoTone,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Checkbox, Form, Input, Space, Switch } from "antd";
import { FormikErrors } from "formik";
import React from "react";
import { Check, Trash, X } from "react-feather";
import { ISubTask } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import FormError from "../form/FormError";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";

export type ISubTaskErrors = FormikErrors<ISubTask>;

export interface ISubTaskProps {
  subTask: ISubTask;
  onChange: (subTask: ISubTask) => void;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onSave: () => void;

  isNew?: boolean;
  disabled?: boolean;
  isEditing?: boolean;
  errorMessage?: string | null;
  onCancelEdit?: () => void;
}

const SubTask: React.SFC<ISubTaskProps> = (props) => {
  const {
    subTask,
    onChange,
    onDelete,
    onCancelEdit,
    errorMessage,
    onToggle,
    onEdit,
    isEditing,
    onSave,
    disabled,
    isNew,
  } = props;

  const renderInputs = () => {
    return (
      <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={errorMessage && <FormError error={errorMessage} />}
          style={{ marginBottom: 8 }}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              const val = event.target.value;
              onChange({ ...subTask, description: val });
            }}
            value={subTask.description}
            placeholder="Enter sub-task description"
            maxLength={blockConstants.maxDescriptionLength}
          />
        </Form.Item>
      </StyledContainer>
    );
  };

  const renderRegularLabel = () => {
    return (
      <StyledContainer s={{ marginBottom: "8px" }}>
        {subTask.description}
      </StyledContainer>
    );
  };

  const renderLabelButtons = () => {
    return (
      <Space>
        {isEditing && (
          <Button
            icon={<Check style={{ width: "18px" }} />}
            onClick={onSave}
            htmlType="button"
            disabled={disabled || subTask.description.length === 0}
          />
        )}
        {isEditing && (
          <Button
            onClick={onCancelEdit}
            icon={<X style={{ width: "18px" }} />}
            disabled={
              isNew || !onCancelEdit || subTask.description.length === 0
            }
            htmlType="button"
          />
        )}
        {!isEditing && (
          <Button
            disabled={disabled}
            icon={<EditOutlined style={{ fontSize: "14px" }} />}
            onClick={onEdit}
            htmlType="button"
          />
        )}
        <Button
          disabled={disabled}
          icon={<Trash style={{ width: "14px" }} />}
          onClick={() => onDelete()}
          htmlType="button"
        />
      </Space>
    );
  };

  const renderLabel = () => {
    return (
      <StyledContainer>
        <Checkbox
          checked={!!subTask.completedAt}
          onChange={onToggle}
          disabled={disabled}
        />
        <StyledContainer
          s={{
            width: "100%",
            flexDirection: "column",
            marginLeft: "16px",
            flex: 1,
          }}
        >
          {isEditing ? renderInputs() : renderRegularLabel()}
          <StyledContainer>{renderLabelButtons()}</StyledContainer>
        </StyledContainer>
      </StyledContainer>
    );
  };

  // const renderDeleteBtn = () => (
  //   <StyledFlatButton onClick={onDelete} style={{ color: "rgb(255, 77, 79)" }}>
  //     <DeleteFilled /> Delete
  //   </StyledFlatButton>
  // );

  // const renderMainControls = () => {
  //   return (
  //     <StyledContainer s={{ flex: 1, marginTop: "8px" }}>
  //       <StyledFlatButton onClick={onEdit} style={{ color: "#1890ff" }}>
  //         <EditTwoTone /> Edit
  //       </StyledFlatButton>
  //       <StyledContainer s={{ marginLeft: "32px" }}>
  //         {renderDeleteBtn()}
  //       </StyledContainer>
  //     </StyledContainer>
  //   );
  // };

  // const renderDescriptionText = () => {
  //   return (
  //     <StyledContainer
  //       s={{
  //         lineHeight: "16px"
  //       }}
  //     >
  //       {subTask.description}
  //     </StyledContainer>
  //   );
  // };

  // const renderEditControls = () => {
  //   return (
  //     <StyledContainer s={{ marginTop: "6px" }}>
  //       {renderDeleteBtn()}
  //       {onCancelEdit && (
  //         <StyledFlatButton
  //           onClick={onCancelEdit}
  //           style={{ marginLeft: "32px", color: "rgb(255, 77, 79)" }}
  //         >
  //           <CloseCircleTwoTone twoToneColor="rgb(255, 77, 79)" /> Cancel
  //         </StyledFlatButton>
  //       )}
  //       {subTask.description.length > 0 && (
  //         <StyledFlatButton
  //           onClick={onSave}
  //           style={{ marginLeft: "32px", color: "#1890ff" }}
  //         >
  //           <SaveTwoTone /> Save
  //         </StyledFlatButton>
  //       )}
  //     </StyledContainer>
  //   );
  // };

  // const renderDescriptionInput = () => {
  //   return (
  //     <React.Fragment>
  //       <Input.TextArea
  //         // TODO: These constants should go in a theme file
  //         autoSize={{ minRows: 2, maxRows: 6 }}
  //         autoComplete="off"
  //         name="description"
  //         placeholder="Description"
  //         onChange={event =>
  //           onChange({
  //             ...subTask,
  //             description: event.target.value
  //           })
  //         }
  //         value={subTask.description}
  //         style={{ marginBottom: 0 }}
  //       />
  //       {errorMessage && <FormError error={errorMessage} />}
  //     </React.Fragment>
  //   );
  // };

  // return (
  //   <StyledSubTaskContainer>
  //     <StyledContainer s={{ marginBottom: "12px" }}>
  //       <Switch checked={!!subTask.completedAt} onChange={onToggle} />
  //     </StyledContainer>
  //     <StyledDescriptionContainer>
  //       {isEditing ? renderDescriptionInput() : renderDescriptionText()}
  //     </StyledDescriptionContainer>
  //     {isEditing ? renderEditControls() : renderMainControls()}
  //   </StyledSubTaskContainer>
  // );

  return renderLabel();
};

export default SubTask;

const StyledSubTaskContainer = styled.div({
  display: "flex",
  flexDirection: "column",
});

const StyledDescriptionContainer = styled.div({
  display: "flex",
  flex: "1",
  flexDirection: "column",
});
