import { Modal } from "antd";
import { AnyFunction } from "../../utils/types";

export function makeDeleteAction(
  onDeleteFn: AnyFunction,
  message = "Are you sure you want to delete this resource?"
) {
  return () => {
    Modal.confirm({
      title: message,
      okText: "Yes",
      cancelText: "No",
      okType: "primary",
      okButtonProps: { danger: true },
      onOk() {
        return onDeleteFn();
      },
      onCancel() {
        // do nothing
      },
    });
  };
}
