import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import ProjectFormInDrawer from "../boardBlock/BoardFormInDrawer";
import AddCollaboratorFormInDrawer from "../collaborator/AddCollaboratorFormInDrawer";
import LabelListWithDrawer from "../label/LabelListWithDrawer";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import StatusListWithDrawer from "../status/StatusListWithDrawer";
import TaskFormInDrawer from "../task/TaskFormInDrawer";

export type BoardFormType =
    | "block-form"
    | "collaborator-form"
    | "status-list-form"
    | "label-list-form";

export interface IBoardFormsProps {
    orgId: string;
    formType: BoardFormType;
    parentBlock: IBlock;
    onClose: () => void;

    block?: IBlock;
    blockType?: BlockType;
}

const BoardForms: React.FC<IBoardFormsProps> = (props) => {
    const { block, formType, onClose, orgId, blockType, parentBlock } = props;

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
            case "task":
                return (
                    <TaskFormInDrawer
                        visible
                        block={block}
                        onClose={onClose}
                        orgId={orgId}
                        parentBlock={parentBlock}
                    />
                );

            case "board":
                return (
                    <ProjectFormInDrawer
                        visible
                        block={block}
                        onClose={onClose}
                        orgId={orgId}
                    />
                );

            case BlockType.Org:
                return (
                    <EditOrgFormInDrawer
                        visible
                        onClose={onClose}
                        block={block}
                    />
                );

            default:
                return null;
        }
    };

    const renderCollaboratorForm = () => {
        if (block) {
            return (
                <AddCollaboratorFormInDrawer
                    visible
                    orgId={orgId}
                    onClose={onClose}
                />
            );
        }

        noBlockWarning();

        return null;
    };

    const renderStatusListForm = () => {
        if (block) {
            return (
                <StatusListWithDrawer visible block={block} onClose={onClose} />
            );
        }

        noBlockWarning();

        return null;
    };

    const renderLabelListForm = () => {
        if (block) {
            return (
                <LabelListWithDrawer visible block={block} onClose={onClose} />
            );
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

export default BoardForms;
