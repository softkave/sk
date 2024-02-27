import { useRequest } from "ahooks";
import React from "react";
import TaskAPI from "../../net/task/endpoints";

export default function useTask(taskId?: string) {
  const fetchTask = React.useCallback(async () => {
    if (taskId) {
      const result = await TaskAPI.getTask({ taskId });
      return result.task;
    }
  }, [taskId]);

  const data = useRequest(fetchTask, { refreshDeps: [taskId] });
  return data;
}
