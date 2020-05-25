import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import AddCollaboratorFormInDrawer from "../collaborator/AddCollaboratorFormInDrawer";
import GroupFormInDrawer from "../group/GroupFormInDrawer";
import LabelListWithDrawer from "../label/LabelListWithDrawer";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import ProjectFormInDrawer from "../project/ProjectFormInDrawer";
import StatusListWithDrawer from "../status/StatusListWithDrawer";
import TaskFormInDrawer from "../task/TaskFormInDrawer";

export type BlockFormType =
  | "block-form"
  | "collaborator-form"
  | "status-list-form"
  | "label-list-form";

export interface IBlockFormsProps {
  orgID: string;
  formType: BlockFormType;
  onClose: () => void;

  parentBlock?: IBlock;
  block?: IBlock;
  blockType?: BlockType;
}

const BlockForms: React.FC<IBlockFormsProps> = (props) => {
  const { block, formType, onClose, orgID, blockType, parentBlock } = props;

  const noBlockWarning = () => {
    console.warn("Block is required for form type, but was not provided");
  };

  const noBlockTypeWarning = () => {
    console.warn(
      "Block type is required for form type 'block-form' because a block was not provided"
    );
  };

  const renderBlockForm = () => {
    if (!blockType) {
      noBlockTypeWarning();

      return null;
    } else if (block && block.type !== blockType) {
      throw new Error(
        "block type and the type of the block provided does not match"
      );
    }

    switch (blockType) {
      case "group":
        return (
          <GroupFormInDrawer
            visible
            onClose={onClose}
            orgID={orgID}
            block={block}
            parentBlock={parentBlock}
          />
        );

      case "task":
        return (
          <TaskFormInDrawer
            visible
            block={block}
            onClose={onClose}
            orgID={orgID}
            parentBlock={parentBlock}
          />
        );

      case "org":
        return <EditOrgFormInDrawer visible block={block} onClose={onClose} />;

      case "project":
        return (
          <ProjectFormInDrawer
            visible
            orgID={orgID}
            block={block}
            onClose={onClose}
            parentBlock={parentBlock}
          />
        );

      default:
        return null;
    }
  };

  const renderCollaboratorForm = () => {
    if (block) {
      return (
        <AddCollaboratorFormInDrawer visible orgID={orgID} onClose={onClose} />
      );
    }

    noBlockWarning();

    return null;
  };

  const renderStatusListForm = () => {
    if (block) {
      return <StatusListWithDrawer visible block={block} onClose={onClose} />;
    }

    noBlockWarning();

    return null;
  };

  const renderLabelListForm = () => {
    if (block) {
      return <LabelListWithDrawer visible block={block} onClose={onClose} />;
    }

    noBlockWarning();

    return null;
  };

  const renderForm = () => {
    switch (formType) {
      case "block-form":
        return renderBlockForm();

      case "collaborator-form":
        return renderCollaboratorForm();

      case "status-list-form":
        return renderStatusListForm();

      case "label-list-form":
        return renderLabelListForm();

      default:
        return null;
    }
  };

  return renderForm();
};

export default BlockForms;
