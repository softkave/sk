import { Modal } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";

const confirmBlockDelete = (block: IBlock, onDelete: any) => {
    const onDeletePromptMessage = (
        <div>Are you sure you want to delete this {block.type}?</div>
    );

    Modal.confirm({
        title: onDeletePromptMessage,
        okText: "Yes",
        cancelText: "No",
        okType: "primary",
        okButtonProps: { danger: true },
        onOk() {
            return onDelete(block);
        },
        onCancel() {
            // do nothing
        },
    });
};

export default confirmBlockDelete;
