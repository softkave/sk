import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Typography } from "antd";
import React from "react";
import { Plus } from "react-feather";
import { IBoardTaskResolution } from "../../models/block/block";
import StyledContainer from "../styled/Container";

export interface ITaskResolutionProps {
    resolutionsList: IBoardTaskResolution[];
    onChange: (value: string) => void;
    onSelectAddNewResolution: () => void;

    disabled?: boolean;
    resolutionId?: string | null;
    className?: string;
}

const ADD_NEW_RESOLUTION_KEY = "add-new-resolution";

const TaskResolution: React.FC<ITaskResolutionProps> = (props) => {
    const {
        resolutionId,
        onChange,
        onSelectAddNewResolution,
        disabled,
        className,
        resolutionsList,
    } = props;

    const selectedResolution = resolutionId
        ? resolutionsList.find((status) => {
              return status.customId === resolutionId;
          })
        : null;

    const getSelectedKeys = () => (resolutionId ? [resolutionId] : []);

    const resolutionsListMenu = (
        <Menu
            onClick={(evt) => {
                if (evt.key === ADD_NEW_RESOLUTION_KEY) {
                    onSelectAddNewResolution();
                    return;
                }

                if (resolutionsList.length === 0) {
                    return;
                }

                if (evt.key !== resolutionId) {
                    onChange(evt.key as string);
                }
            }}
            selectedKeys={getSelectedKeys()}
        >
            <Menu.Item key={ADD_NEW_RESOLUTION_KEY}>
                <Space align="center" size={12}>
                    <Plus
                        style={{
                            width: "16px",
                            height: "16px",
                            verticalAlign: "middle",
                            marginTop: "-3px",
                        }}
                    />
                    New Resolution
                </Space>
            </Menu.Item>
            <Menu.Divider />
            {resolutionsList.map((resolution) => {
                return (
                    <Menu.Item key={resolution.customId}>
                        {resolution.name}
                    </Menu.Item>
                );
            })}
            {resolutionsList.length === 0 && (
                <Menu.Item style={{ textAlign: "center", padding: "8px" }}>
                    <Typography.Text type="secondary">
                        No resolutions yet
                    </Typography.Text>
                </Menu.Item>
            )}
        </Menu>
    );

    const renderSelectedResolution = () => {
        return (
            <StyledContainer
                s={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    display: "inline-flex",
                }}
            >
                <Space>
                    <Typography.Text type="secondary">
                        {selectedResolution
                            ? selectedResolution.name
                            : "Resolution"}
                    </Typography.Text>
                    <CaretDownOutlined
                        style={{
                            fontSize: "10px",
                            color: disabled ? "#f5f5f5" : undefined,
                        }}
                    />
                </Space>
            </StyledContainer>
        );
    };

    return (
        <Dropdown
            disabled={disabled}
            overlay={resolutionsListMenu}
            trigger={["click"]}
            className={className}
        >
            {renderSelectedResolution()}
        </Dropdown>
    );
};

export default React.memo(TaskResolution);
