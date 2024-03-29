import { Button, Modal, Space } from "antd";
import React from "react";
import { ArrowRight, X as CloseIcon } from "react-feather";
import { ITask } from "../../models/task/types";

import { IBoardStatusResolution } from "../../models/board/types";
import TaskNameAndDescription from "./TaskNameAndDescription";
import TaskResolution from "./TaskResolution";

export interface ISelectResolutionModalProps {
  task: ITask;
  resolutionsList: IBoardStatusResolution[];
  resolutionsMap: { [key: string]: IBoardStatusResolution };
  onSelectResolution: (value: string) => void;
  onSelectAddNewResolution: () => void;
  onCancel: () => void;
  onContinue: () => void;
}

const SelectResolutionModal: React.FC<ISelectResolutionModalProps> = (props) => {
  const {
    task,
    resolutionsList,
    resolutionsMap,
    onSelectResolution,
    onCancel,
    onContinue,
    onSelectAddNewResolution,
  } = props;

  const content = (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <div>
        <div style={{ flex: 1, marginRight: "16px" }}>
          <TaskNameAndDescription task={task} />
        </div>
        <Button onClick={onCancel} className="icon-btn">
          <CloseIcon />
        </Button>
      </div>
      <div style={{ justifyContent: "flex-end" }}>
        <Space size="large">
          <TaskResolution
            resolutionsMap={resolutionsMap}
            resolutionsList={resolutionsList}
            onChange={onSelectResolution}
            onSelectAddNewResolution={onSelectAddNewResolution}
          />
          <Button onClick={onContinue} className="icon-btn">
            <ArrowRight />
          </Button>
        </Space>
      </div>
    </Space>
  );

  return (
    <Modal visible footer={null} title={null} closable={false}>
      {content}
    </Modal>
  );
};

export default React.memo(SelectResolutionModal);
