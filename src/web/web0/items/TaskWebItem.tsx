import { Badge, Typography } from "antd";
import { noop } from "lodash";
import React from "react";
import Column from "../../../components/board/Column";
import StyledContainer from "../../../components/styled/Container";
import TaskList from "../../../components/task/TaskList";
import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import { demoStatuses, demoTasks, demoUsers } from "./data";
import WebItem from "./Item";

const TasksWebItem: React.FC<{}> = () => {
    const label = (
        <Typography.Paragraph>
            Manage <Typography.Text strong>tasks</Typography.Text> with{" "}
            <Typography.Text strong>status</Typography.Text> and{" "}
            <Typography.Text strong>priority</Typography.Text>.
        </Typography.Paragraph>
    );

    const statuses = [demoStatuses[0]];
    const defaultStatus = statuses[0];
    const columnHeader = (
        <StyledContainer>
            <Typography.Text
                strong
                style={{ marginRight: "8px", textTransform: "capitalize" }}
            >
                {defaultStatus.name}
            </Typography.Text>
            <Badge
                count={demoTasks.length}
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            />
        </StyledContainer>
    );

    const columnBody = (
        <TaskList
            demo
            board={{} as IBlock}
            user={{} as IUser}
            labelList={[]}
            resolutionsList={[]}
            users={[demoUsers.abayomi, demoUsers.solomon]}
            tasks={demoTasks.reverse()}
            statusList={statuses}
            toggleForm={noop}
        />
    );

    const content = (
        <StyledContainer>
            <Column
                header={columnHeader}
                body={columnBody}
                style={{ width: "100%" }}
            />
        </StyledContainer>
    );

    return <WebItem content={content} label={label} />;
};

export default TasksWebItem;
