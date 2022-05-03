import { LoadingOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Checkbox } from "antd";
import React from "react";
import { ISubTask } from "../../models/block/block";

export interface ITaskSubTaskProps {
  subTask: ISubTask;
  onToggleSubTask: () => Promise<void>;
}

const classes = {
  root: css({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: "16px",
  }),
};

const TaskSubTask: React.FC<ITaskSubTaskProps> = (props) => {
  const { subTask, onToggleSubTask } = props;
  const [loading, setLoading] = React.useState(false);
  const internalOnToggle = React.useCallback(async () => {
    setLoading(true);
    await onToggleSubTask();
    setLoading(false);
  }, [setLoading, onToggleSubTask]);

  return (
    <div key={subTask.customId} className={classes.root}>
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
      <div>{subTask.description}</div>
    </div>
  );
};

export default TaskSubTask;
