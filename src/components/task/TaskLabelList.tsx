import { Space } from "antd";
import React from "react";
import {
  IBlockAssignedLabelInput,
  IBlockLabel,
} from "../../models/block/block";
import TaskLabel from "./TaskLabel";

export interface ITaskLabelListProps {
  labelsMap: { [key: string]: IBlockLabel };
  disabled?: boolean;
  labels?: IBlockAssignedLabelInput[];
  canRemove?: boolean;
  onRemove?: (id: string) => void;
}

const TaskLabelList: React.FC<ITaskLabelListProps> = (props) => {
  const { canRemove, onRemove, disabled, labelsMap } = props;
  const labels = props.labels || [];
  const labelNodes: React.ReactNode[] = labels.map((assignedLabel) => {
    const label: IBlockLabel = labelsMap[assignedLabel.customId];
    if (label) {
      return (
        <TaskLabel
          key={label.customId}
          label={label}
          canRemove={canRemove}
          disabled={disabled}
          onRemove={onRemove}
        />
      );
    }

    return null;
  });

  return (
    <Space wrap size={[4, 4]}>
      {labelNodes}
    </Space>
  );
};

export default React.memo(TaskLabelList);
