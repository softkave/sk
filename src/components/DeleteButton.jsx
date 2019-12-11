import React from "react";
import { Modal, Button } from "antd";

export default class DeleteButton extends React.Component {
  static defaultProps = {
    title: "Are you sure delete this resource?",
    content: null,
    okText: "Yes",
    cancelText: "No"
  };

  showDeleteConfirm = () => {
    const { onDelete, title, content, okText, cancelText } = this.props;
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

  render() {
    const { deleteButton } = this.props;
    const renderedButton = React.cloneElement(deleteButton, {
      onClick: this.showDeleteConfirm
    }) || (
      <Button icon="delete" type="danger" onClick={this.showDeleteConfirm} />
    );

    return renderedButton;
  }
}
