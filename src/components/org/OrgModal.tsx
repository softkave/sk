import { Modal } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import OrgContainer from "./OrgContainer";

export interface IOrgModalProps {
  onClose: () => void;

  block?: IBlock;
}

const OrgModal: React.FC<IOrgModalProps> = (props) => {
  return (
    <Modal visible footer={null} closable={false}>
      <OrgContainer {...props} />
    </Modal>
  );
};

export default OrgModal;
