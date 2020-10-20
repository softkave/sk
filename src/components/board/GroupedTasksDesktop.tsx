import { Badge, Typography } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import TaskListContainer from "../task/TaskListContainer";
import Scrollbar from "../utilities/Scrollbar";
import Column from "./Column";
import { IBoardGroupedTasks } from "./types";

export interface IGroupedTasksDesktopProps {
    groupedTasks: IBoardGroupedTasks[];
    users: IUser[];
    board: IBlock;
    onClickUpdateBlock: (block: IBlock) => void;
}

const GroupedTasksDesktop: React.FC<IGroupedTasksDesktopProps> = (props) => {
    const { groupedTasks, users, board, onClickUpdateBlock } = props;

    const renderColumnHeader = (group: IBoardGroupedTasks) => {
        return (
            <StyledContainer>
                {group.color && (
                    <Avatar
                        shape="square"
                        size="small"
                        style={{ backgroundColor: group.color }}
                    />
                )}
                <Typography.Text
                    style={{
                        margin: "0 8px",
                        textTransform: "capitalize",
                    }}
                >
                    {group.name}
                </Typography.Text>
                <Badge
                    count={group.tasks.length}
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                />
            </StyledContainer>
        );
    };

    const renderColumn = (group: IBoardGroupedTasks, i: number) => {
        return (
            <Column
                key={group.id}
                header={renderColumnHeader(group)}
                body={
                    <Scrollbar style={{ flex: 1 }}>
                        <TaskListContainer
                            board={board}
                            users={users}
                            tasks={group.tasks}
                            toggleForm={onClickUpdateBlock}
                            style={{ height: "100%" }}
                        />
                    </Scrollbar>
                }
                style={{
                    marginLeft: "16px",
                    paddingRight:
                        i === groupedTasks.length - 1 ? "16px" : undefined,
                    minWidth:
                        i === groupedTasks.length - 1
                            ? 280 + 16
                            : "280px !important",
                }}
            />
        );
    };

    const renderGroups = () => {
        return groupedTasks.map((group, i) => renderColumn(group, i));
    };

    if (groupedTasks.length === 0) {
        return <EmptyMessage>Board is empty!</EmptyMessage>;
    }

    return (
        <StyledContainer
            s={{
                overflowX: "auto",
                width: "100%",
                flex: 1,
                marginTop: "22px",
            }}
        >
            {renderGroups()}
        </StyledContainer>
    );
};

export default GroupedTasksDesktop;
