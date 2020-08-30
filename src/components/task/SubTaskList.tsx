import { PlusOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { FormikTouched } from "formik";
import React from "react";
import { ISubTask } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { getDateString, newId } from "../../utils/utils";
import useArray from "../hooks/useArray";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import SubTask, { ISubTaskErrors } from "./SubTask";

export interface ISubTaskListProps {
    subTasks: ISubTask[];
    user: IUser;
    onChange: (value: ISubTask[]) => void;
    onAddSubTask: (value: ISubTask) => void;
    onDeleteSubTask: (index: number) => void;
    onDiscardSubTaskChanges: (index: number) => void;

    disabled?: boolean;
    errors?: ISubTaskErrors[];
    touched?: FormikTouched<ISubTask[]>;
}

const SubTaskList: React.SFC<ISubTaskListProps> = (props) => {
    const {
        subTasks: value,
        onChange,
        errors: subTaskErrors,
        disabled,
        user,
        onAddSubTask,
        onDeleteSubTask,
        onDiscardSubTaskChanges,
        touched,
    } = props;
    const editingSubTasksList = useArray<string>();
    const newSubTasksIdList = useArray<string>();
    const subTasks = value || [];
    const errors = subTaskErrors || [];

    const internalOnAdd = () => {
        const subTask: ISubTask = {
            customId: newId(),
            description: "",
            createdAt: getDateString(),
            createdBy: user.customId,
        };

        onAddSubTask(subTask);
        editingSubTasksList.add(subTask.customId);
        newSubTasksIdList.add(subTask.customId);
    };

    const internalOnEditSubTask = (index: number, data: Partial<ISubTask>) => {
        const subTask: ISubTask = {
            ...subTasks[index],
            ...data,
            updatedAt: getDateString(),
            updatedBy: user.customId,
        };
        const newSubTasks = [...subTasks];
        newSubTasks[index] = subTask;
        onChange(newSubTasks);
    };

    const onToggleSubTask = (index: number) => {
        const subTask = subTasks[index];
        const isCompleted = !!subTask.completedAt;

        internalOnEditSubTask(index, {
            completedAt: isCompleted ? undefined : getDateString(),
            completedBy: isCompleted ? undefined : user.customId,
        });
    };

    const internalOnDeleteSubTask = (index: number) => {
        const subTask = subTasks[index];
        onDeleteSubTask(index);
        editingSubTasksList.remove(subTask.customId);
    };

    const internalOnDiscardSubTaskChanges = (index: number) => {
        const subTask = subTasks[index];
        editingSubTasksList.remove(subTask.customId);
        onDiscardSubTaskChanges(index);
    };

    const internalOnCommitSubTaskChanges = (index: number) => {
        const subTask = subTasks[index];
        editingSubTasksList.remove(subTask.customId);
        internalOnEditSubTask(index, {
            updatedAt: getDateString(),
            updatedBy: user.customId,
        });
    };

    const renderSubTask = (
        subTask: ISubTask,
        error: ISubTaskErrors = {},
        subTaskTouched: FormikTouched<ISubTask> = {},
        index: number
    ) => {
        return (
            <SubTask
                isEditing={editingSubTasksList.exists(subTask.customId)}
                errorMessage={
                    subTaskTouched.description ? error.description : undefined
                }
                onCancelEdit={() => internalOnDiscardSubTaskChanges(index)}
                onChange={(update) => internalOnEditSubTask(index, update)}
                onDelete={() => internalOnDeleteSubTask(index)}
                onToggle={() => onToggleSubTask(index)}
                onEdit={() => {
                    editingSubTasksList.add(subTask.customId);
                }}
                onSave={() => internalOnCommitSubTaskChanges(index)}
                subTask={subTask}
                isNew={newSubTasksIdList.exists(subTask.customId)}
                disabled={disabled}
            />
        );
    };

    const renderSubTaskList = () => {
        const tchd = touched || [];
        return (
            <React.Fragment>
                {subTasks.map((subTask, index) => (
                    <React.Fragment key={subTask.customId}>
                        {renderSubTask(
                            subTask,
                            errors[index],
                            tchd[index],
                            index
                        )}
                        {index < subTasks.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    };

    const renderLabel = () => {
        return (
            <StyledContainer
                s={{ width: "100%", lineHeight: "40px", fontWeight: 600 }}
            >
                <StyledContainer s={{ flex: 1 }}>
                    Sub-tasks ({subTasks.length} of {blockConstants.maxSubTasks}
                    )
                </StyledContainer>
                <StyledFlatButton
                    disabled={
                        disabled ||
                        subTasks.length >= blockConstants.maxSubTasks
                    }
                    onClick={internalOnAdd}
                >
                    <PlusOutlined />
                </StyledFlatButton>
            </StyledContainer>
        );
    };

    return (
        <div>
            {renderLabel()}
            {renderSubTaskList()}
        </div>
    );
};

export default SubTaskList;
