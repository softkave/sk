import { Badge, Typography } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import DeviceScrollbar from "../utilities/DeviceScrollbar";
import Column from "./Column";
import { IBGroupedTasksGroup } from "./types";

export interface IBRenderGroupedTasksDesktopProps {
    groups: IBGroupedTasksGroup[];
    users: IUser[];
    onClickUpdateBlock: (block: IBlock) => void;
}

const BRenderGroupedTasksDesktop: React.FC<IBRenderGroupedTasksDesktopProps> = (
    props
) => {
    const { groups, users, onClickUpdateBlock } = props;

    const renderColumnHeader = (group: IBGroupedTasksGroup) => {
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

    const renderColumn = (group: IBGroupedTasksGroup, i: number) => {
        return (
            <Column
                key={group.id}
                header={renderColumnHeader(group)}
                body={
                    <DeviceScrollbar style={{ flex: 1 }}>
                        <TaskList
                            users={users}
                            tasks={group.tasks}
                            toggleForm={onClickUpdateBlock}
                            style={{ height: "100%" }}
                        />
                    </DeviceScrollbar>
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

export default React.memo(BRenderGroupedTasksDesktop);
