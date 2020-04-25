import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import randomColor from "randomcolor";
import React from "react";
import { IBlockLabel } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { newId } from "../../utils/utils";
import StyledContainer from "../styled/Container";
import LabelThumbnail from "./LabelThumbnail";

export interface ILabelListProps {
  user: IUser;
  labelList: IBlockLabel[];
  saveChanges: (labelList: IBlockLabel[]) => Promise<void>;
}

const LabelList: React.FC<ILabelListProps> = (props) => {
  const { labelList, saveChanges, user } = props;
  const [labelListState, setLabelListState] = React.useState<IBlockLabel[]>(
    labelList
  );

  const onDelete = (index: number) => {
    const newLabelList = [...labelListState];
    delete newLabelList[index];
    setLabelListState(newLabelList);
  };

  const onChange = (index: number, data: Partial<IBlockLabel>) => {
    const newLabelList = [...labelListState];
    const label = { ...newLabelList[index], ...data };
    newLabelList[index] = label;
    setLabelListState(newLabelList);
  };

  const renderList = () => {
    return labelList.map((label, index) => {
      return (
        <LabelThumbnail
          key={label.customId}
          label={label}
          onChange={(data) => onChange(index, data)}
          onDelete={() => onDelete(index)}
        />
      );
    });
  };

  const renderSubmitControls = () => {
    return (
      <StyledContainer>
        <Button type="primary" onClick={() => saveChanges(labelListState)}>
          Save Changes
        </Button>
      </StyledContainer>
    );
  };

  const onAddNewLabel = () => {
    const label: IBlockLabel = {
      name: "",
      description: "",
      color: randomColor(),
      createdAt: Date.now(),
      createdBy: user.customId,
      customId: newId(),
    };

    // TODO
  };

  const renderAddControls = () => {
    if (labelListState.length < blockConstants.maxAvailableLabels) {
      return (
        <StyledContainer>
          <Button icon={<PlusOutlined />}>New Label</Button>
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

export default React.memo(LabelList);
