import { Badge, Space, Tabs } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";
import TaskListContainer from "../task/TaskListContainer";
import { IBoardGroupedTasks } from "./types";

export interface IGroupedTasksMobileProps {
    board: IBlock;
    groupedTasks: IBoardGroupedTasks[];
    users: IUser[];
    onClickUpdateBlock: (block: IBlock) => void;
}

const GroupedTasksMobile: React.FC<IGroupedTasksMobileProps> = (props) => {
    const { groupedTasks, users, board, onClickUpdateBlock } = props;

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
                <StyledContainer
                    s={{ padding: "0 16px", height: "100%", overflowY: "auto" }}
                >
                    <TaskListContainer
                        users={users}
                        tasks={group.tasks}
                        board={board}
                        toggleForm={onClickUpdateBlock}
                    />
                </StyledContainer>
            </Tabs.TabPane>
        );
    };

    return (
        <Tabs
            defaultActiveKey={
                groupedTasks[0] ? groupedTasks[0].name : undefined
            }
            tabBarGutter={0}
            style={{ marginTop: "12px" }}
        >
            {groupedTasks.map(renderTab)}
        </Tabs>
    );
};

export default GroupedTasksMobile;
