import { Badge, Space, Tabs, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import React from "react";
import Scrollbars from "react-custom-scrollbars";
import { IBlock } from "../../models/block/block";
import Message from "../Message";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import { ITasksContainerRenderFnProps } from "./TasksContainer";
import { IBoardGroupedTasks } from "./types";

export interface IGroupedTasksMobileProps extends ITasksContainerRenderFnProps {
    groupedTasks: IBoardGroupedTasks[];
    onClickUpdateBlock: (block: IBlock) => void;
    emptyMessage?: string;
}

const GroupedTasksMobile: React.FC<IGroupedTasksMobileProps> = (props) => {
    const { groupedTasks, emptyMessage, onClickUpdateBlock } = props;

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
                <Scrollbars>
                    <TaskList
                        {...props}
                        tasks={group.tasks}
                        toggleForm={onClickUpdateBlock}
                        getBlockStyle={() => ({ padding: "0 16px" })}
                    />
                </Scrollbars>
            </Tabs.TabPane>
        );
    };

    if (groupedTasks.length === 0) {
        return <Message message={emptyMessage || "Board is empty!"} />;
    }

    return (
        <StyledContainer
            s={{
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
            }}
        >
            <Tabs
                defaultActiveKey={
                    groupedTasks[0] ? groupedTasks[0].name : undefined
                }
                tabBarGutter={0}
                moreIcon={<RightOutlined />}
            >
                {groupedTasks.map(renderTab)}
            </Tabs>
        </StyledContainer>
    );
};

export default GroupedTasksMobile;
