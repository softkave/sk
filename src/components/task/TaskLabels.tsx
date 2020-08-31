import { Button, Dropdown, Menu, Space, Tag } from "antd";
import React from "react";
import { Plus } from "react-feather";
import { IBlockAssignedLabel, IBlockLabel } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { indexArray } from "../../utils/object";
import { getDateString } from "../../utils/utils";
import StyledContainer from "../styled/Container";

export interface ITaskLabelsProps {
    user: IUser;
    labelList: IBlockLabel[];
    onChange: (ids: IBlockAssignedLabel[]) => void;

    disabled?: boolean;
    labels?: IBlockAssignedLabel[];
    priority?: React.ReactNode;
}

const TaskLabels: React.FC<ITaskLabelsProps> = (props) => {
    const { onChange, disabled, user, labelList, priority } = props;
    const labels = props.labels || [];
    const idToLabelMap = React.useMemo(
        () => indexArray(labelList || [], { path: "customId" }),
        [labelList]
    );

    const onAdd = (id: string) => {
        const i = labels.findIndex((label) => label.customId === id);

        if (i === -1) {
            onChange([
                ...labels,
                {
                    customId: id,
                    assignedAt: getDateString(),
                    assignedBy: user.customId,
                },
            ]);
        }
    };

    const onRemove = (id: string) => {
        const index = labels.findIndex((label) => label.customId === id);
        const newLabels = [...labels];
        newLabels.splice(index, 1);
        onChange(newLabels);
    };

    const renderLabelTag = (label: IBlockLabel, canRemove) => {
        return (
            <Tag
                closable={disabled ? false : canRemove}
                key={label.customId}
                color={label.color}
                onClose={() => {
                    if (!disabled) {
                        onRemove(label.customId);
                    }
                }}
            >
                {label.name}
            </Tag>
        );
    };

    const renderSelectedLabels = () => {
        const renderedLabels: React.ReactNode[] = labels.map(
            (assignedLabel) => {
                const label: IBlockLabel = idToLabelMap[assignedLabel.customId];

                if (label) {
                    return renderLabelTag(label, true);
                }

                return null;
            }
        );

        if (priority) {
            renderedLabels.unshift(priority);
        }

        return renderedLabels;
    };

    const renderAddNewLabel = () => {
        const renderedLabelMenuItems = labelList.map((label) => {
            return (
                <Menu.Item key={label.customId}>
                    {renderLabelTag(label, false)}
                </Menu.Item>
            );
        });

        const labelListMenu = (
            <Menu
                onClick={(evt) => {
                    onAdd(evt.key as string);
                }}
                selectedKeys={labels.map((label) => label.customId)}
            >
                {renderedLabelMenuItems}
                {renderedLabelMenuItems.length === 0 && (
                    <StyledContainer
                        s={{ justifyContent: "center", padding: "8px" }}
                    >
                        No Labels
                    </StyledContainer>
                )}
            </Menu>
        );

        return (
            <Dropdown overlay={labelListMenu} trigger={["click"]}>
                <Button
                    disabled={disabled}
                    htmlType="button"
                    className="icon-btn"
                >
                    <Plus />
                </Button>
            </Dropdown>
        );
    };

    return (
        <StyledContainer>
            <Space direction="vertical">
                <Space size={2}>
                    {renderSelectedLabels()}
                    {!disabled && renderAddNewLabel()}
                </Space>
            </Space>
        </StyledContainer>
    );
};

export default React.memo(TaskLabels);
