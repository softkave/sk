import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React from "react";

export interface IDeleteButtonProps {
  onDelete: () => void;
  title?: React.ReactNode;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;
}

const DeleteButtonWithPrompt: React.FC<IDeleteButtonProps> = props => {
  const { onDelete, title, content, okText, cancelText, children } = props;

  const showDeleteConfirm = () => {
    Modal.confirm({
      title,
      content,
      okText,
      cancelText,
      okType: "danger",
      onOk() {
        if (typeof onDelete === "function") {
          onDelete();
        }
      },
      onCancel() {
        // Do nothing
      }
    });
  };

  const singleChild = React.Children.only(children);

  if (!React.isValidElement(singleChild)) {
    return (
      <Button type="danger" onClick={showDeleteConfirm}>
        <DeleteOutlined />
      </Button>
    );
  }

  return React.cloneElement(singleChild, {
    onClick: showDeleteConfirm
  });
};

DeleteButtonWithPrompt.defaultProps = {
  title: "Are you sure delete this resource?",
  okText: "Yes",
  cancelText: "No"
};

export default DeleteButtonWithPrompt;
