import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Typography } from "antd";
import React from "react";
import { Minus } from "react-feather";
import { IBoardStatus, IBoardStatusResolution } from "../../models/board/types";
import { sortStatusList } from "../../models/board/utils";
import { ITask } from "../../models/task/types";
import SkTag from "../utils/SkTag";
import { AntDMenuItemType } from "../utils/types";
import SelectResolutionModal from "./SelectResolutionModal";
import TaskResolution from "./TaskResolution";

export interface ITaskStatusProps {
  task: ITask;
  statusList: IBoardStatus[];
  statusMap: { [key: string]: IBoardStatus };
  resolutionsList: IBoardStatusResolution[];
  resolutionsMap: { [key: string]: IBoardStatusResolution };
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
const DIVIDER_MENU_KEY = "divider-key";
const NO_STATUS_MENU_KEY = "no-status-key";

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
    statusMap,
    resolutionsList,
    resolutionsMap,
    noResolutionModal,
  } = props;

  const [resolutionModalState, setResolutionModalState] = React.useState<IResolutionModalState>({});

  const statusId = task.status;
  const resolutionId = task.taskResolution;
  const selectedStatus = statusId ? statusMap[statusId] : null;
  const lastStatus = statusList[statusList.length - 1];
  const selectedStatusIsLastStatus =
    lastStatus && selectedStatus && selectedStatus.customId === lastStatus.customId;

  const handleResolutionModalChange = React.useCallback(
    (selectedResolutionId?: string) => {
      const selectedStatusId = resolutionModalState.statusId!;
      setResolutionModalState({});
      onChangeStatus(selectedStatusId, selectedResolutionId);
    },
    [resolutionModalState, onChangeStatus]
  );

  const onContinueWithoutResolution = React.useCallback(() => {
    handleResolutionModalChange();
  }, [handleResolutionModalChange]);

  const onCancel = React.useCallback(() => {
    setResolutionModalState({});
  }, []);

  const handleStatusChange = React.useCallback(
    async (value: string) => {
      if (
        !noResolutionModal &&
        resolutionsList.length > 0 &&
        lastStatus &&
        value === lastStatus.customId
      ) {
        setResolutionModalState({ statusId: value, showModal: true });
      } else {
        onChangeStatus(value);
      }
    },
    [lastStatus, noResolutionModal, onChangeStatus, resolutionsList.length]
  );

  const getSelectedKeys = () => (statusId ? [statusId] : []);
  const statusWithColor = (status: IBoardStatus) => (
    <span style={{ borderBottom: `2px solid ${status.color}` }}>{status.name}</span>
  );

  const items: AntDMenuItemType[] = sortStatusList(statusList).map((status) => {
    return {
      key: status.customId,
      label: <SkTag>{status.name}</SkTag>,
    };
  });

  if (items.length === 0) {
    items.push({
      label: (
        <Typography.Text type="secondary">Click the plus button to create a status</Typography.Text>
      ),
      key: NO_STATUS_MENU_KEY,
    });
  }

  items.unshift(
    {
      icon: <PlusOutlined />,
      label: "Create Status",
      key: ADD_NEW_STATUS_KEY,
    },
    {
      type: "divider",
      key: DIVIDER_MENU_KEY,
    }
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
      items={items}
    ></Menu>
  );

  const selectedStatusElem = (
    <div
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        flex: 1,
      }}
    >
      <Space align="center">
        {selectedStatus ? (
          statusWithColor(selectedStatus)
        ) : (
          <Typography.Text type="secondary">Select status</Typography.Text>
        )}
        <CaretDownOutlined
          style={{
            fontSize: "10px",
            color: disabled ? "#f5f5f5" : "#999",
          }}
        />
      </Space>
    </div>
  );

  const resolutionElem = selectedStatusIsLastStatus && (
    <TaskResolution
      resolutionId={resolutionId}
      resolutionsList={resolutionsList}
      resolutionsMap={resolutionsMap}
      onChange={onChangeResolution}
      disabled={disabled}
      onSelectAddNewResolution={onSelectAddNewResolution}
    />
  );

  return (
    <div style={{ display: "flex", flex: 1 }}>
      {resolutionModalState.showModal && (
        <SelectResolutionModal
          task={task}
          resolutionsList={resolutionsList}
          resolutionsMap={resolutionsMap}
          onContinue={onContinueWithoutResolution}
          onCancel={onCancel}
          onSelectResolution={handleResolutionModalChange}
          onSelectAddNewResolution={onSelectAddNewResolution}
        />
      )}
      <div style={{ display: "flex", flex: 1, marginRight: "6px" }}>
        <Dropdown
          disabled={disabled}
          overlay={statusListMenu}
          trigger={["click"]}
          className={className}
        >
          {selectedStatusElem}
        </Dropdown>
      </div>
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
          <div
            style={{
              flex: 1,
              marginRight: "6px",
            }}
          >
            {resolutionElem}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default React.memo(TaskStatus);
