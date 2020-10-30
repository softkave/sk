/*eslint no-useless-computed-key: "off"*/

import { Badge, Space, Tabs } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import TaskListContainer from "../task/TaskListContainer";
import Scrollbar from "../utilities/Scrollbar";
import { IBoardGroupedTasks } from "./types";

export interface IGroupedTasksMobileProps {
    board: IBlock;
    groupedTasks: IBoardGroupedTasks[];
    users: IUser[];
    onClickUpdateBlock: (block: IBlock) => void;
    emptyMessage?: string;
}

const GroupedTasksMobile: React.FC<IGroupedTasksMobileProps> = (props) => {
    const {
        groupedTasks,
        users,
        board,
        emptyMessage,
        onClickUpdateBlock,
    } = props;

    const renderTab = (group: IBoardGroupedTasks) => {
        return (
            <Tabs.TabPane
                tab={
                    <span
                        style={{
                            textTransform: "capitalize",
                            padding: "0 16px",
                        }}
                    >
                        <Space>
                            <span>{group.name}</span>
                            <Badge
                                count={group.tasks.length}
                                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                            />
                        </Space>
                    </span>
                }
                key={group.name}
            >
                <Scrollbar style={{ height: "100%" }}>
                    <TaskListContainer
                        users={users}
                        tasks={group.tasks}
                        board={board}
                        toggleForm={onClickUpdateBlock}
                        getBlockStyle={() => ({ padding: "0 16px" })}
                    />
                </Scrollbar>
            </Tabs.TabPane>
        );
    };

    if (groupedTasks.length === 0) {
        return <EmptyMessage>{emptyMessage || "Board is empty!"}</EmptyMessage>;
    }

    return (
        <StyledContainer
            s={{
                flex: 1,
                overflow: "hidden",

                ["& .ant-tabs"]: {
                    height: "100%",
                },

                ["& .ant-tabs-content"]: {
                    height: "100%",
                },

                ["& .ant-tabs-content-holder"]: {
                    overflow: "hidden",
                },

                ["& .ant-tabs-nav"]: { margin: 0 },
            }}
        >
            <Tabs
                defaultActiveKey={
                    groupedTasks[0] ? groupedTasks[0].name : undefined
                }
                tabBarGutter={0}
            >
                {groupedTasks.map(renderTab)}
            </Tabs>
        </StyledContainer>
    );
};

export default GroupedTasksMobile;
