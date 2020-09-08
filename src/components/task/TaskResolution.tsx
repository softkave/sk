import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { IBoardTaskResolution } from "../../models/block/block";
import StyledContainer from "../styled/Container";

export interface ITaskResolutionProps {
    resolutionsList: IBoardTaskResolution[];
    onChange: (value: string) => void;

    disabled?: boolean;
    resolutionId?: string | null;
    className?: string;
}

// TODO: should we show a loading screen or no when the resolution is changed?

const TaskResolution: React.FC<ITaskResolutionProps> = (props) => {
    const {
        resolutionId: value,
        onChange,
        disabled,
        className,
        resolutionsList,
    } = props;

    const selectedResolution = value
        ? resolutionsList.find((status) => {
              return status.customId === value;
          })
        : null;

    const getSelectedKeys = () => (value ? [value] : []);

    const resolutionsListMenu = (
        <Menu
            onClick={(evt) => {
                if (evt.key !== value) {
                    onChange(evt.key as string);
                }
            }}
            selectedKeys={getSelectedKeys()}
        >
            {resolutionsList.map((resolution) => {
                return (
                    <Menu.Item key={resolution.customId}>
                        {resolution.name}
                    </Menu.Item>
                );
            })}
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
                    {selectedResolution
                        ? selectedResolution.name
                        : "Select resolution"}
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

    if (disabled) {
        return renderSelectedResolution();
    }

    return (
        <Dropdown
            overlay={resolutionsListMenu}
            trigger={["click"]}
            className={className}
        >
            {renderSelectedResolution()}
        </Dropdown>
    );
};

export default React.memo(TaskResolution);
