import { Avatar, Space, Tabs } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";
import TaskListContainer from "../task/TaskListContainer";
import { IBoardGroupedTasksGroup } from "./types";

export interface IBoardRenderGroupedTasksMobileProps {
    board: IBlock;
    groups: IBoardGroupedTasksGroup[];
    users: IUser[];
    onClickUpdateBlock: (block: IBlock) => void;
}

const BoardRenderGroupedTasksMobile: React.FC<IBoardRenderGroupedTasksMobileProps> = (
    props
) => {
    const { groups, users, board, onClickUpdateBlock } = props;

    const renderTab = (group: IBoardGroupedTasksGroup) => {
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
                            <Avatar
                                size="small"
                                shape="square"
                                style={{ backgroundColor: group.color }}
                            />
                            <span>{group.name}</span>
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
            defaultActiveKey={groups[0] ? groups[0].name : undefined}
            tabBarGutter={0}
            style={{ marginTop: "12px" }}
        >
            {groups.map(renderTab)}
        </Tabs>
    );
};

export default BoardRenderGroupedTasksMobile;