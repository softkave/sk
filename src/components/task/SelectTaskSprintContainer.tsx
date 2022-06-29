import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { ISprint } from "../../models/sprint/types";
import { ITask } from "../../models/task/types";
import { updateTaskOpAction } from "../../redux/operations/task/updateTask";
import { AppDispatch } from "../../redux/types";
import { getDateString } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import SelectTaskSprint, { BACKLOG } from "./SelectTaskSprint";

export interface ISelectTaskSprintContainerProps {
  task: ITask;
  userId: string;
  sprints: ISprint[];
  sprintsMap: { [key: string]: ISprint };
  disabled?: boolean;
  demo?: boolean;
  onAddNewSprint: () => void;
}

const SelectTaskSprintContainer: React.FC<ISelectTaskSprintContainerProps> = (
  props
) => {
  const { task, demo, userId } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();

  const onChangeSprint = React.useCallback(
    async (sprintId: string) => {
      if (demo) {
        return false;
      }

      setIsLoading(true);
      const result = await dispatch(
        updateTaskOpAction({
          taskId: task.customId,
          data: {
            taskSprint:
              sprintId === BACKLOG
                ? null
                : {
                    sprintId: sprintId,
                    assignedAt: getDateString(),
                    assignedBy: userId,
                  },
          },
          deleteOpOnComplete: true,
        })
      );

      const op = unwrapResult(result);

      if (op) {
        const opData = getOpData(op);

        if (opData.isError) {
          message.error(ERROR_UPDATING_TASK_SPRINT);
        }
      }

      setIsLoading(false);
    },
    [demo, dispatch, task.customId]
  );

  if (isLoading) {
    return <LoadingOutlined />;
  }

  return <SelectTaskSprint {...props} onChangeSprint={onChangeSprint} />;
};

export default React.memo(SelectTaskSprintContainer);

const ERROR_UPDATING_TASK_SPRINT = "Error updating task sprint.";
