import { Avatar, Space } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";

export interface ITaskThumbnailAssigneesProps {
  task: IBlock;
  users: IUser[];
}

const TaskThumbnailAssignees: React.FC<ITaskThumbnailAssigneesProps> = (
  props
) => {
  const { task, users } = props;
  const assignees = task.assignees || [];

  if (assignees.length === 0 || users.length === 0) {
    return null;
  }

  const usersMap = users.reduce((accumulator, user) => {
    accumulator[user.customId] = user;
    return accumulator;
  }, {} as { [key: string]: IUser });

  const rendered: React.ReactNode[] = [];

  for (const assignee of assignees) {
    const user = usersMap[assignee.userId];

    if (!user) {
      continue;
    }

    rendered.push(
      <Avatar
        key={user.customId}
        size="small"
        shape="square"
        style={{
          backgroundColor: user.color,
        }}
      />
    );
  }

  if (rendered.length === 0) {
    return null;
  }

  return <Space>{rendered}</Space>;
};

export default React.memo(TaskThumbnailAssignees);
