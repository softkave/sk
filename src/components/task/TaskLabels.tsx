import { PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Space, Tag, Typography } from "antd";
import React from "react";
import { Plus } from "react-feather";
import { IBlockAssignedLabel, IBlockLabel } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getDateString, indexArray } from "../../utils/utils";
import StyledContainer from "../styled/Container";

export interface ITaskLabelsProps {
    user: IUser;
    labelList: IBlockLabel[];
    onChange: (ids: IBlockAssignedLabel[]) => void;
    onSelectAddNewLabel: () => void;

    disabled?: boolean;
    labels?: IBlockAssignedLabel[];
}

const ADD_NEW_LABEL_KEY = "add-new-label";

const TaskLabels: React.FC<ITaskLabelsProps> = (props) => {
    const { onChange, onSelectAddNewLabel, disabled, user, labelList } = props;
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
                    if (evt.key === ADD_NEW_LABEL_KEY) {
                        onSelectAddNewLabel();
                        return;
                    }

                    if (renderedLabelMenuItems.length === 0) {
                        return;
                    }

                    onAdd(evt.key as string);
                }}
                selectedKeys={labels.map((label) => label.customId)}
            >
                <Menu.Item key={ADD_NEW_LABEL_KEY}>
                    <PlusOutlined /> Label
                    {/* <Space align="center" size={12}>
                        <Plus
                            style={{
                                width: "16px",
                                height: "16px",
                                verticalAlign: "middle",
                                marginTop: "-3px",
                            }}
                        />
                        New Label
                    </Space> */}
                </Menu.Item>
                <Menu.Divider />
                {renderedLabelMenuItems}
                {renderedLabelMenuItems.length === 0 && (
                    <Menu.Item style={{ padding: "8px", textAlign: "center" }}>
                        <Typography.Text type="secondary">
                            No labels yet
                        </Typography.Text>
                    </Menu.Item>
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
