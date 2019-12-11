import React from "react";
import { Icon, Modal } from "antd";

export default function showLoading() {
  return Modal.info({
    content: (
      <div>
        <Icon type="loading" />
      </div>
    )
  });
}
