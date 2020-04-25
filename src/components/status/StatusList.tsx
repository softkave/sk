import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { IBlockStatus } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { newId } from "../../utils/utils";
import StyledContainer from "../styled/Container";
import StatusThumbnail from "./StatusThumbnail";

export interface IStatusListProps {
  user: IUser;
  statusList: IBlockStatus[];
  saveChanges: (statusList: IBlockStatus[]) => Promise<void>;
}

const StatusList: React.FC<IStatusListProps> = (props) => {
  const { statusList, saveChanges, user } = props;
  const [statusListState, setStatusListState] = React.useState<IBlockStatus[]>(
    statusList
  );

  const onDelete = (index: number) => {
    const newStatusList = [...statusListState];
    delete newStatusList[index];
    setStatusListState(newStatusList);
  };

  const onChange = (index: number, data: Partial<IBlockStatus>) => {
    const newStatusList = [...statusListState];
    const status = { ...newStatusList[index], ...data };
    newStatusList[index] = status;
    setStatusListState(newStatusList);
  };

  const renderList = () => {
    return statusList.map((status, index) => {
      return (
        <StatusThumbnail
          key={status.customId}
          status={status}
          onChange={(data) => onChange(index, data)}
          onDelete={() => onDelete(index)}
        />
      );
    });
  };

  const renderSubmitControls = () => {
    return (
      <StyledContainer>
        <Button type="primary" onClick={() => saveChanges(statusListState)}>
          Save Changes
        </Button>
      </StyledContainer>
    );
  };

  const onAddNewStatus = () => {
    const status: IBlockStatus = {
      name: "",
      description: "",
      createdAt: Date.now(),
      createdBy: user.customId,
      customId: newId(),
    };

    // TODO
  };

  const renderAddControls = () => {
    if (statusListState.length < blockConstants.maxAvailableLabels) {
      return (
        <StyledContainer>
          <Button icon={<PlusOutlined />}>New Status</Button>
        </StyledContainer>
      );
    }

    return null;
  };

  return (
    <StyledContainer s={{ width: "100%", height: "100%" }}>
      {renderAddControls()}
      <StyledContainer
        s={{ flexDirection: "column", flex: 1, overflowY: "auto" }}
      >
        {renderList()}
      </StyledContainer>
      {renderSubmitControls()}
    </StyledContainer>
  );
};

export default React.memo(StatusList);
