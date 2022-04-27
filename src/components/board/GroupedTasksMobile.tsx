import { Badge, Space, Tabs, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import React from "react";
import Message from "../Message";

import TaskList from "../task/TaskList";
import { ITasksContainerRenderFnProps } from "./TasksContainer";
import { IBoardGroupedTasks } from "./types";
import { ITask } from "../../models/task/types";
import { css } from "@emotion/css";

export interface IGroupedTasksMobileProps extends ITasksContainerRenderFnProps {
  groupedTasks: IBoardGroupedTasks[];
  onClickUpdateTask: (task: ITask) => void;
  emptyMessage?: string;
}

const classes = {
  taskList: css({ padding: "0 16px" }),
};

const GroupedTasksMobile: React.FC<IGroupedTasksMobileProps> = (props) => {
  const {
    groupedTasks,
    emptyMessage,
    onClickUpdateTask: onClickUpdateBlock,
  } = props;

  const renderTab = (group: IBoardGroupedTasks) => {
    return (
      <Tabs.TabPane
        tab={
          <span
            style={{
              padding: "0 16px",
            }}
          >
            <Space>
              <Typography.Text
                style={{
                  textTransform: "uppercase",
                }}
              >
                {group.name}
              </Typography.Text>
              <Badge
                count={group.tasks.length}
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              />
            </Space>
          </span>
        }
        key={group.name}
      >
        <TaskList
          {...props}
          disableDragAndDrop
          tasks={group.tasks}
          toggleForm={onClickUpdateBlock}
          className={classes.taskList}
        />
      </Tabs.TabPane>
    );
  };

  if (groupedTasks.length === 0) {
    return <Message message={emptyMessage || "Board is empty."} />;
  }

  return (
    <div
      className={css({
        display: "flex",
        flex: 1,
        overflow: "hidden",

        "& .ant-tabs": {
          height: "100%",
        },

        "& .ant-tabs-content": {
          height: "100%",
        },

        "& .ant-tabs-content-holder": {
          overflow: "hidden",
        },

        "& .ant-tabs-nav": { margin: 0 },
      })}
    >
      <Tabs
        defaultActiveKey={groupedTasks[0] ? groupedTasks[0].name : undefined}
        tabBarGutter={0}
        moreIcon={<RightOutlined />}
      >
        {groupedTasks.map(renderTab)}
      </Tabs>
    </div>
  );
};

export default GroupedTasksMobile;
