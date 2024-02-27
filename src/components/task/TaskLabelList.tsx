import { Space } from "antd";
import React from "react";
import { IBoardLabel } from "../../models/board/types";
import { ITaskAssignedLabel } from "../../models/task/types";
import TaskLabel from "./TaskLabel";

export interface ITaskLabelListProps {
  labelsMap: { [key: string]: IBoardLabel };
  disabled?: boolean;
  labels?: ITaskAssignedLabel[];
  canRemove?: boolean;
  onRemove?: (id: string) => void;
}

const TaskLabelList: React.FC<ITaskLabelListProps> = (props) => {
  const { canRemove, onRemove, disabled, labelsMap } = props;
  const labels = props.labels || [];
  const labelNodes: React.ReactNode[] = labels.map((assignedLabel) => {
    const label: IBoardLabel = labelsMap[assignedLabel.labelId];
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
    <Space wrap size={[0, 4]}>
      {labelNodes}
    </Space>
  );
};

export default React.memo(TaskLabelList);
