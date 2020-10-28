import CaretDownOutlined from "@ant-design/icons/CaretDownOutlined";
import { Space, Tag } from "antd";
import React from "react";
import { BlockPriority } from "../../models/block/block";

export type TaskPriority = BlockPriority;

export const priorityToColorMap = {
    [BlockPriority.NotImportant]: "#EACA2C",
    [BlockPriority.Important]: "#7ED321",
    [BlockPriority.VeryImportant]: "rgb(255, 77, 79)",
};

interface IPriorityProps {
    level: TaskPriority;
    className?: string;
    withSelectIcon?: boolean;
}

const Priority: React.FC<IPriorityProps> = (props) => {
    const { level, className, withSelectIcon } = props;

    let content: React.ReactNode = level;

    if (withSelectIcon) {
        content = (
            <Space>
                {level}
                <CaretDownOutlined style={{ fontSize: "10px" }} />
            </Space>
        );
    }

    return (
        <Tag color={priorityToColorMap[props.level]} className={className}>
            {content}
        </Tag>
    );
};

export default Priority;
