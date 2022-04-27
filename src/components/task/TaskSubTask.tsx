import { LoadingOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import React from "react";
import { ISubTask } from "../../models/block/block";

export interface ITaskSubTaskProps {
  subTask: ISubTask;
  onToggleSubTask: () => Promise<void>;
}

const TaskSubTask: React.FC<ITaskSubTaskProps> = (props) => {
  const { subTask, onToggleSubTask } = props;

  const [loading, setLoading] = React.useState(false);

  const internalOnToggle = React.useCallback(async () => {
    setLoading(true);
    await onToggleSubTask();
    setLoading(false);
  }, [setLoading, onToggleSubTask]);

  return (
    <div
      key={subTask.customId}
      // className={css({
      //     "& *": { fontSize: "13px !important" },
      // })}
    >
      <div>
        {loading ? (
          <LoadingOutlined />
        ) : (
          <Checkbox
            checked={!!subTask.completedBy}
            onChange={internalOnToggle}
          />
        )}
      </div>
      <div style={{ marginLeft: "16px", flex: 1 }}>{subTask.description}</div>
    </div>
  );
};

export default TaskSubTask;
