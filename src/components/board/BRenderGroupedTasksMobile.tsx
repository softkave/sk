import { Avatar, Space, Tabs } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import { IBGroupedTasksGroup } from "./types";

export interface IBRenderGroupedTasksMobileProps {
    groups: IBGroupedTasksGroup[];
    users: IUser[];
    onClickUpdateBlock: (block: IBlock) => void;
}

const BRenderGroupedTasksMobile: React.FC<IBRenderGroupedTasksMobileProps> = (
    props
) => {
    const { groups, users, onClickUpdateBlock } = props;

    const renderTab = (group: IBGroupedTasksGroup) => {
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
                    <TaskList
                        users={users}
                        tasks={group.tasks}
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

export default React.memo(BRenderGroupedTasksMobile);
