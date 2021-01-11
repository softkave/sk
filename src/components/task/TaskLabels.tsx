import { PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Tag, Typography } from "antd";
import React from "react";
import { Plus } from "react-feather";
import {
    IBlockAssignedLabelInput,
    IBlockLabel,
} from "../../models/block/block";
import StyledContainer from "../styled/Container";

export interface ITaskLabelsProps {
    labelList: IBlockLabel[];
    labelsMap: { [key: string]: IBlockLabel };
    onChange: (ids: IBlockAssignedLabelInput[]) => void;
    onSelectAddNewLabel: () => void;

    disabled?: boolean;
    labels?: IBlockAssignedLabelInput[];
}

const ADD_NEW_LABEL_KEY = "add-new-label";

const TaskLabels: React.FC<ITaskLabelsProps> = (props) => {
    const {
        onChange,
        onSelectAddNewLabel,
        disabled,
        labelList,
        labelsMap,
    } = props;

    const labels = props.labels || [];

    const onAdd = (id: string) => {
        const i = labels.findIndex((label) => label.customId === id);

        if (i === -1) {
            onChange([
                ...labels,
                {
                    customId: id,
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
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginBottom: "2px",
                }}
            >
                {label.name}
            </Tag>
        );
    };

    const renderSelectedLabels = () => {
        const renderedLabels: React.ReactNode[] = labels.map(
            (assignedLabel) => {
                const label: IBlockLabel = labelsMap[assignedLabel.customId];

                if (label) {
                    return renderLabelTag(label, true);
                }

                return null;
            }
        );

        return <div>{renderedLabels}</div>;
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
                multiple
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
        <StyledContainer s={{ alignItems: "center" }}>
            {renderSelectedLabels()}
            {!disabled && renderAddNewLabel()}
        </StyledContainer>
    );
};

export default React.memo(TaskLabels);
