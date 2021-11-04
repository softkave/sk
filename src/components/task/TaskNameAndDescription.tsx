import { Space, Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";

export interface ITaskNameAndDescriptionProps {
    task: IBlock;
}

const TaskNameAndDescription: React.FC<ITaskNameAndDescriptionProps> = (
    props
) => {
    const { task } = props;

    if (task.name && task.description) {
        return (
            <Space direction="vertical">
                <Typography.Paragraph style={{ marginBottom: "0" }}>
                    {task.name}
                </Typography.Paragraph>
                {/* <Typography.Paragraph
                    type={"secondary"}
                    ellipsis={{
                        rows: 2,
                        expandable: true,
                    }}
                    style={{ marginBottom: "0" }}
                >
                    {task.description}
                </Typography.Paragraph> */}
            </Space>
        );
    }

    if (task.name) {
        return (
            <Typography.Paragraph style={{ marginBottom: "0" }}>
                {task.name}
            </Typography.Paragraph>
        );
    }

    // if (task.description) {
    //     return (
    //         <Typography.Paragraph
    //             type={"secondary"}
    //             ellipsis={{
    //                 rows: 2,
    //                 expandable: true,
    //             }}
    //             style={{ marginBottom: "0" }}
    //         >
    //             {task.description}
    //         </Typography.Paragraph>
    //     );
    // }

    return null;
};

export default React.memo(TaskNameAndDescription);
