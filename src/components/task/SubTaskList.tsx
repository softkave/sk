import { Divider } from "antd";
import React from "react";
import SubTask, { ISubTaskValues } from "./SubTask";

export interface ISubTaskListProps {
  subTasks: ISubTaskValues[];
  onChange: (value: ISubTaskValues[]) => void;
}

const SubTaskList: React.SFC<ISubTaskListProps> = props => {
  const { subTasks: value, onChange } = props;
  const subTasks = value || [];

  const onDeleteSubTask = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const onUpdateSubTask = (index: number, update: ISubTaskValues) => {
    const newValue = [...value];
    const subTask = { ...newValue[index], ...update };
    newValue[index] = subTask;
    onChange(newValue);
  };

  return (
    <div>
      {subTasks.map((subTask, index) => (
        <React.Fragment>
          <SubTask
            subTask={subTask}
            onChange={update => onUpdateSubTask(index, update)}
            onDelete={() => onDeleteSubTask(index)}
          />
          {index !== subTasks.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SubTaskList;
