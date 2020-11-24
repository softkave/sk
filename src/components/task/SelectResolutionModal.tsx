import { Button, Modal, Space } from "antd";
import React from "react";
import { X as CloseIcon } from "react-feather";
import {
    BlockPriority,
    IBlock,
    IBoardTaskResolution,
} from "../../models/block/block";
import StyledContainer from "../styled/Container";
import Priority from "./Priority";
import TaskNameAndDescription from "./TaskNameAndDescription";
import TaskResolution from "./TaskResolution";

export interface ISelectResolutionModalProps {
    task: IBlock;
    resolutionsList: IBoardTaskResolution[];
    resolutionsMap: { [key: string]: IBoardTaskResolution };
    onSelectResolution: (value: string) => void;
    onSelectAddNewResolution: () => void;
    onClose: () => void;
}

const SelectResolutionModal: React.FC<ISelectResolutionModalProps> = (
    props
) => {
    const {
        task,
        resolutionsList,
        resolutionsMap,
        onSelectResolution,
        onClose,
        onSelectAddNewResolution,
    } = props;

    const content = (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <StyledContainer>
                <StyledContainer s={{ flex: 1 }}>
                    <Priority level={task.priority as BlockPriority} />
                </StyledContainer>
                <StyledContainer>
                    <Button onClick={onClose} className="icon-btn">
                        <CloseIcon />
                    </Button>
                </StyledContainer>
            </StyledContainer>
            <TaskNameAndDescription task={task} />
            <StyledContainer>
                <TaskResolution
                    resolutionsMap={resolutionsMap}
                    resolutionsList={resolutionsList}
                    onChange={onSelectResolution}
                    onSelectAddNewResolution={onSelectAddNewResolution}
                />
            </StyledContainer>
        </Space>
    );

    return (
        <Modal visible footer={null} title={null} closable={false}>
            {content}
        </Modal>
    );
};

export default React.memo(SelectResolutionModal);
