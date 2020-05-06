import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import StyledContainer from "../styled/Container";

export interface ITaskStatusProps {
  orgID: string;
  onChange: (value: string) => void;

  disabled?: boolean;
  statusID?: string;
}

// TODO: should we show a loading screen or no when the status is changed?

const TaskStatus: React.FC<ITaskStatusProps> = (props) => {
  const { orgID, statusID: value, onChange, disabled } = props;
  const org = useSelector<IReduxState, IBlock>((state) => {
    return getBlock(state, orgID)!;
  });

  const statusList = org.availableStatus || [];

  const selectedStatus = value
    ? statusList.find((status) => {
        return status.customId === value;
      })
    : null;

  const getSelectedKeys = () => (value ? [value] : []);

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
        return <Menu.Item key={status.customId}>{status.name}</Menu.Item>;
      })}
    </Menu>
  );

  const renderSelectedStatus = () => {
    return (
      <StyledContainer s={{ cursor: disabled ? "not-allowed" : "pointer" }}>
        <Space>
          {selectedStatus?.name || "No status"}
          <CaretDownOutlined style={{ fontSize: "10px" }} />
        </Space>
      </StyledContainer>
    );
  };

  if (disabled) {
    return renderSelectedStatus();
  }

  return (
    <Dropdown overlay={statusListMenu} trigger={["click"]}>
      {renderSelectedStatus()}
    </Dropdown>
  );
};

export default React.memo(TaskStatus);
