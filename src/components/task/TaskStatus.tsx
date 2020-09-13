import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { Minus, Plus } from "react-feather";
import {
    IBlock,
    IBlockStatus,
    IBoardTaskResolution,
} from "../../models/block/block";
import StyledContainer from "../styled/Container";
import SelectResolutionModal from "./SelectResolutionModal";
import TaskResolution from "./TaskResolution";

export interface ITaskStatusProps {
    task: IBlock;
    statusList: IBlockStatus[];
    resolutionsList: IBoardTaskResolution[];
    onChangeStatus: (statusId: string, resolutionId?: string) => void;
    onChangeResolution: (value: string) => void;
    onSelectAddNewStatus: () => void;
    onSelectAddNewResolution: () => void;

    disabled?: boolean;
    className?: string;
    noResolutionModal?: boolean;
}

interface IResolutionModalState {
    statusId?: string;
    showModal?: boolean;
}

const ADD_NEW_STATUS_KEY = "add-new-status";

// TODO: should we show a loading screen or no when the status is changed?

const TaskStatus: React.FC<ITaskStatusProps> = (props) => {
    const {
        task,
        onChangeStatus,
        onChangeResolution,
        onSelectAddNewStatus,
        onSelectAddNewResolution,
        disabled,
        className,
        statusList,
        resolutionsList,
        noResolutionModal,
    } = props;

    const [resolutionModalState, setResolutionModalState] = React.useState<
        IResolutionModalState
    >({});

    const statusId = task.status;
    const resolutionId = task.taskResolution;
    const selectedStatus = statusId
        ? statusList.find((status) => {
              return status.customId === statusId;
          })
        : null;
    const lastStatus = statusList[statusList.length - 1];
    const selectedStatusIsLastStatus =
        lastStatus &&
        selectedStatus &&
        selectedStatus.customId === lastStatus.customId;

    const handleResolutionModalChange = React.useCallback(
        (selectedResolutionId?: string) => {
            const selectedStatusId = resolutionModalState.statusId!;
            setResolutionModalState({});
            onChangeStatus(selectedStatusId, selectedResolutionId);
        },
        [resolutionModalState, onChangeStatus]
    );

    const closeResolutionModal = React.useCallback(() => {
        handleResolutionModalChange();
    }, [handleResolutionModalChange]);

    const handleStatusChange = React.useCallback(
        async (value: string) => {
            if (
                !noResolutionModal &&
                resolutionsList.length > 0 &&
                value === lastStatus.customId
            ) {
                setResolutionModalState({ statusId: value, showModal: true });
            } else {
                onChangeStatus(value);
            }
        },
        [
            lastStatus.customId,
            noResolutionModal,
            onChangeStatus,
            resolutionsList.length,
        ]
    );

    const getSelectedKeys = () => (statusId ? [statusId] : []);

    const statusWithColor = (status: IBlockStatus) => (
        <span style={{ borderBottom: `2px solid ${status.color}` }}>
            {status.name}
        </span>
    );

    const statusListMenu = (
        <Menu
            onClick={(evt) => {
                if (evt.key === ADD_NEW_STATUS_KEY) {
                    onSelectAddNewStatus();
                    return;
                }

                if (evt.key !== statusId) {
                    handleStatusChange(evt.key as string);
                }
            }}
            selectedKeys={getSelectedKeys()}
        >
            <Menu.Item key={ADD_NEW_STATUS_KEY}>
                <Space align="center" size={12}>
                    <Plus
                        style={{
                            width: "16px",
                            height: "16px",
                            verticalAlign: "middle",
                            marginTop: "-3px",
                        }}
                    />
                    New Status
                </Space>
            </Menu.Item>
            <Menu.Divider />
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
                {selectedStatus ? statusWithColor(selectedStatus) : "Status"}
                <CaretDownOutlined
                    style={{
                        fontSize: "10px",
                        color: disabled ? "#f5f5f5" : undefined,
                    }}
                />
            </Space>
        </StyledContainer>
    );

    const resolutionElem = selectedStatusIsLastStatus && (
        <TaskResolution
            resolutionId={resolutionId}
            resolutionsList={resolutionsList}
            onChange={onChangeResolution}
            disabled={disabled}
            onSelectAddNewResolution={onSelectAddNewResolution}
        />
    );

    return (
        <StyledContainer s={{ flex: 1 }}>
            {resolutionModalState.showModal && (
                <SelectResolutionModal
                    task={task}
                    resolutionsList={resolutionsList}
                    onClose={closeResolutionModal}
                    onSelectResolution={handleResolutionModalChange}
                    onSelectAddNewResolution={onSelectAddNewResolution}
                />
            )}
            <StyledContainer s={{ flex: 1, marginRight: "6px" }}>
                <Dropdown
                    disabled={disabled}
                    overlay={statusListMenu}
                    trigger={["click"]}
                    className={className}
                >
                    {selectedStatusElem}
                </Dropdown>
            </StyledContainer>
            {resolutionElem && (
                <React.Fragment>
                    <span
                        style={{
                            padding: "0 16px",
                            display: "inline-flex",
                            alignItems: "center",
                        }}
                    >
                        <Minus style={{ width: "12px", height: "12px" }} />
                    </span>
                    <StyledContainer
                        s={{
                            flex: 1,
                            justifyContent: "flex-end",
                            marginRight: "6px",
                        }}
                    >
                        {resolutionElem}
                    </StyledContainer>
                </React.Fragment>
            )}
        </StyledContainer>
    );
};

export default React.memo(TaskStatus);
