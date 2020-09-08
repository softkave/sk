import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { Minus } from "react-feather";
import { IBlockStatus, IBoardTaskResolution } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import TaskResolution from "./TaskResolution";

export interface ITaskStatusProps {
    statusList: IBlockStatus[];
    resolutionsList: IBoardTaskResolution[];
    onChangeStatus: (value: string) => void;
    onChangeResolution: (value: string) => void;

    disabled?: boolean;
    statusId?: string;
    resolutionId?: string | null;
    className?: string;
}

// TODO: should we show a loading screen or no when the status is changed?

const TaskStatus: React.FC<ITaskStatusProps> = (props) => {
    const {
        statusId,
        onChangeStatus,
        onChangeResolution,
        disabled,
        className,
        statusList,
        resolutionsList,
        resolutionId,
    } = props;

    const selectedStatus = statusId
        ? statusList.find((status) => {
              return status.customId === statusId;
          })
        : null;

    const getSelectedKeys = () => (statusId ? [statusId] : []);

    const statusWithColor = (status: IBlockStatus) => (
        <span style={{ borderBottom: `2px solid ${status.color}` }}>
            {status.name}
        </span>
    );

    const statusListMenu = (
        <Menu
            onClick={(evt) => {
                if (evt.key !== statusId) {
                    onChangeStatus(evt.key as string);
                }
            }}
            selectedKeys={getSelectedKeys()}
        >
            {statusList.map((status) => {
                return (
                    <Menu.Item key={status.customId}>
                        {statusWithColor(status)}
                    </Menu.Item>
                );
            })}
        </Menu>
    );

    const selectedStatusElem = (
        <StyledContainer
            s={{
                cursor: disabled ? "not-allowed" : "pointer",
                display: "inline-flex",
                flex: 1,
            }}
        >
            <Space>
                {selectedStatus
                    ? statusWithColor(selectedStatus)
                    : "Choose status"}
                <CaretDownOutlined
                    style={{
                        fontSize: "10px",
                        color: disabled ? "#f5f5f5" : undefined,
                    }}
                />
            </Space>
        </StyledContainer>
    );

    const lastStatus = statusList[statusList.length - 1];
    const selectedStatusIsLastStatus =
        lastStatus &&
        selectedStatus &&
        selectedStatus.customId === lastStatus.customId;

    const resolutionElem = selectedStatusIsLastStatus && (
        <TaskResolution
            resolutionId={resolutionId}
            resolutionsList={resolutionsList}
            onChange={onChangeResolution}
            disabled={disabled}
        />
    );

    if (disabled) {
        return (
            <StyledContainer>
                {selectedStatusElem}
                {resolutionElem && (
                    <React.Fragment>
                        <span style={{ padding: "0 24px" }}>
                            <Minus />
                        </span>
                        <StyledContainer s={{ flex: 1 }}>
                            <TaskResolution
                                resolutionId={resolutionId}
                                resolutionsList={resolutionsList}
                                onChange={onChangeResolution}
                                disabled={disabled}
                            />
                        </StyledContainer>
                    </React.Fragment>
                )}
            </StyledContainer>
        );
    }

    return (
        <StyledContainer>
            <StyledContainer s={{ flex: 1 }}>
                <Dropdown
                    overlay={statusListMenu}
                    trigger={["click"]}
                    className={className}
                >
                    {selectedStatusElem}
                </Dropdown>
            </StyledContainer>
            {resolutionElem && (
                <React.Fragment>
                    <span style={{ padding: "0 24px" }}>
                        <Minus />
                    </span>
                    <StyledContainer s={{ flex: 1 }}>
                        {resolutionElem}
                    </StyledContainer>
                </React.Fragment>
            )}
        </StyledContainer>
    );
};

export default React.memo(TaskStatus);
