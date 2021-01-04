import { Badge, Space, Typography } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";
import { IBlock } from "../../models/block/block";
import { getNameInitials } from "../../models/utils";
import Message from "../Message";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import Scrollbar from "../utilities/Scrollbar";
import Column from "./Column";
import { ITasksContainerRenderFnProps } from "./TasksContainer";
import { IBoardGroupedTasks } from "./types";

export interface IGroupedTasksDesktopProps
    extends ITasksContainerRenderFnProps {
    groupedTasks: IBoardGroupedTasks[];
    onClickUpdateBlock: (block: IBlock) => void;
    renderColumnHeaderOptions?: (group: IBoardGroupedTasks) => React.ReactNode;
    emptyMessage?: string;
}

const GroupedTasksDesktop: React.FC<IGroupedTasksDesktopProps> = (props) => {
    const {
        groupedTasks,
        emptyMessage,
        onClickUpdateBlock,
        renderColumnHeaderOptions,
    } = props;

    const renderColumnHeader = (group: IBoardGroupedTasks) => {
        const defaultContent = (
            <Space>
                {group.color && (
                    <Avatar
                        shape="square"
                        size="small"
                        style={{ backgroundColor: group.color }}
                    >
                        {getNameInitials(group.name)}
                    </Avatar>
                )}
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
        );

        let content: React.ReactNode = defaultContent;

        if (renderColumnHeaderOptions) {
            content = (
                <React.Fragment>
                    <StyledContainer s={{ flex: 1 }}>
                        {defaultContent}
                    </StyledContainer>
                    {renderColumnHeaderOptions(group)}
                </React.Fragment>
            );
        }

        return content;
    };

    const renderColumn = (group: IBoardGroupedTasks, i: number) => {
        return (
            <Column
                key={group.id}
                header={renderColumnHeader(group)}
                body={
                    <Scrollbar style={{ flex: 1 }}>
                        <TaskList
                            {...props}
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
        return <Message message={emptyMessage || "Board is empty!"} />;
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
