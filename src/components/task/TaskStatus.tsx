import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/store";
import StyledContainer from "../styled/Container";

export interface ITaskStatusProps {
  orgId: string;
  onChange: (value: string) => void;

  disabled?: boolean;
  statusId?: string;
  className?: string;
}

// TODO: should we show a loading screen or no when the status is changed?

const TaskStatus: React.FC<ITaskStatusProps> = (props) => {
  const { orgId, statusId: value, onChange, disabled, className } = props;
  const org = useSelector<IAppState, IBlock>((state) => {
    return getBlock(state, orgId)!;
  });

  const statusList = org.boardStatuses || [];

  const selectedStatus = value
    ? statusList.find((status) => {
        return status.customId === value;
      })
    : null;

  const getSelectedKeys = () => (value ? [value] : []);

  const statusWithColor = (status: IBlockStatus) => (
    <span style={{ borderBottom: `2px solid ${status.color}` }}>
      {status.name}
    </span>
  );

  const statusListMenu = (
    <Menu
      onClick={(evt) => {
        if (evt.key !== value) {
          onChange(evt.key);
        }
      }}
      selectedKeys={getSelectedKeys()}
    >
      {statusList.map((status) => {
        return (
          <Menu.Item key={status.customId}>{statusWithColor(status)}</Menu.Item>
        );
      })}
    </Menu>
  );

  const renderSelectedStatus = () => {
    return (
      <StyledContainer
        s={{
          cursor: disabled ? "not-allowed" : "pointer",
          display: "inline-flex",
        }}
      >
        <Space>
          {selectedStatus ? statusWithColor(selectedStatus) : "No status"}
          <CaretDownOutlined style={{ fontSize: "10px" }} />
        </Space>
      </StyledContainer>
    );
  };

  if (disabled) {
    return renderSelectedStatus();
  }

  return (
    <Dropdown
      overlay={statusListMenu}
      trigger={["click"]}
      className={className}
    >
      {renderSelectedStatus()}
    </Dropdown>
  );
};

export default React.memo(TaskStatus);
