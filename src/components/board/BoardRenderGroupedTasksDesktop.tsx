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
import { IBoardGroupedTasksGroup } from "./types";

export interface IBoardRenderGroupedTasksDesktopProps {
    groups: IBoardGroupedTasksGroup[];
    users: IUser[];
    board: IBlock;
    onClickUpdateBlock: (block: IBlock) => void;
}

const BoardRenderGroupedTasksDesktop: React.FC<IBoardRenderGroupedTasksDesktopProps> = (
    props
) => {
    const { groups, users, board, onClickUpdateBlock } = props;

    const renderColumnHeader = (group: IBoardGroupedTasksGroup) => {
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

    const renderColumn = (group: IBoardGroupedTasksGroup, i: number) => {
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
                    paddingRight: i === groups.length - 1 ? "16px" : undefined,
                    minWidth:
                        i === groups.length - 1 ? 280 + 16 : "280px !important",
                }}
            />
        );
    };

    const renderGroups = () => {
        return groups.map((group, i) => renderColumn(group, i));
    };

    if (groups.length === 0) {
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

export default BoardRenderGroupedTasksDesktop;
