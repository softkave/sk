import CaretDownOutlined from "@ant-design/icons/CaretDownOutlined";
import { Space, Tag, Typography } from "antd";
import React from "react";
import { BlockPriority } from "../../models/block/block";

export type TaskPriority = BlockPriority;

export const priorityToColorMap = {
    [BlockPriority.NotImportant]: "#EACA2C",
    [BlockPriority.Important]: "#7ED321",
    [BlockPriority.VeryImportant]: "rgb(255, 77, 79)",
};

export const priorityToTextMap = {
    [BlockPriority.NotImportant]: "Low",
    [BlockPriority.Important]: "Medium",
    [BlockPriority.VeryImportant]: "High",
};

// const levelMap: Record<TaskPriority, string> = {
//     [BlockPriority.Important]: "medium",
//     [BlockPriority.VeryImportant]: "high",
//     [BlockPriority.NotImportant]: "low",
// };

interface IPriorityProps {
    level: TaskPriority;
    className?: string;
    withSelectIcon?: boolean;
}

const Priority: React.FC<IPriorityProps> = (props) => {
    const { level, className, withSelectIcon } = props;

    // let label = levelMap[level];
    const label = priorityToTextMap[level];
    let content: React.ReactNode = label;

    if (withSelectIcon) {
        content = (
            <Space>
                {label}
                <CaretDownOutlined style={{ fontSize: "10px" }} />
            </Space>
        );
    }

    return (
        <Typography.Text
            style={{
                color: priorityToColorMap[props.level],
                textTransform: "capitalize",
                fontSize: "13px",
            }}
            className={className}
        >
            {content}
        </Typography.Text>
    );
};

export default Priority;
