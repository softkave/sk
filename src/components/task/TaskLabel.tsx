import { Tag } from "antd";
import React from "react";
import { IBoardLabel } from "../../models/board/types";

export interface ITaskLabelProps {
  label: IBoardLabel;
  disabled?: boolean;
  canRemove?: boolean;
  onRemove?: (id: string) => void;
}

const TaskLabel: React.FC<ITaskLabelProps> = (props) => {
  const { canRemove, onRemove, disabled, label } = props;
  return (
    <Tag
      closable={disabled ? false : canRemove}
      key={label.customId}
      onClose={() => {
        if (!disabled) {
          onRemove && onRemove(label.customId);
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginBottom: "2px",
        color: label.color,
        textTransform: "capitalize",
      }}
    >
      {label.name}
    </Tag>
  );
};

export default React.memo(TaskLabel);
