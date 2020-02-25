import React from "react";
import { useSelector, useStore } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import addCollaboratorsOperationFunc from "../../redux/operations/block/addCollaborators";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import OperationIDs, {
  addCollaboratorsOperationID
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import AddCollaboratorFormContainer from "../collaborator/AddCollaboratorFormContainer";
import GroupFormContainer from "../group/GroupFormContainer";
import useBlockParents from "../hooks/useBlockParent";
import EditOrgFormContainer from "../org/EditOrgFormContainer";
import ProjectFormContainer from "../project/ProjectFormContainer";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import StyledCapitalizeText from "../styled/StyledCapitalizeText";
import TaskFormContainer from "../task/TaskFormContainer";

const StyledContainerAsH3 = StyledContainer.withComponent("h3");

export type BlockFormType =
  | "add-block-form"
  | "update-block-form"
  | "collaborator-form";

export interface IBlockFormsProps {
  block: IBlock;
  formType: BlockFormType;
  onClose: () => void;
  parent?: IBlock;
}

const BlockForms: React.FC<IBlockFormsProps> = props => {
  const { block, formType, onClose, parent } = props;
  const store = useStore();
  const parents = useBlockParents(block);
  const user = useSelector(getSignedInUserRequired);
  const organizationID =
    block.type === "org" ? block.customId : block.rootBlockID;
  const organization = useSelector<IReduxState, IBlock>(
    state => getBlock(state, organizationID)!
  );
  const collaboratorIDs = Array.isArray(organization.collaborators)
    ? organization.collaborators
    : [];
  const collaborators = useSelector<IReduxState, IUser[]>(state =>
    getUsersAsArray(state, collaboratorIDs)
  );
  const requestIDs = Array.isArray(organization.collaborationRequests)
    ? organization.collaborationRequests
    : [];
  const requests = useSelector<IReduxState, INotification[]>(state =>
    getNotificationsAsArray(state, requestIDs)
  );
  const formActionType = formType === "update-block-form" ? "Edit" : "Create";
  const formName =
    formType === "collaborator-form"
      ? "Collaborator"
      : getBlockTypeFullName(block.type);

  const formLabel = (
    <StyledCapitalizeText>
      {formActionType} {formName}
    </StyledCapitalizeText>
  );

  const getFormParents = (formBlock: IBlock) => {
    // if (formBlock.customId !== block.customId) {
    //   const blockGroups = getBlocksAsArray(
    //     store.getState(),
    //     block.groups || []
    //   );
    //   return [block].concat(blockGroups);
    // }

    const hasParents = parents.length > 0;

    // immediate parent
    const parent0 = hasParents ? parents[parents.length - 1] : null;
    const hasParent0 = !!parent0;

    if (block.type !== "org") {
      if (hasParent0) {
        const parent0Groups =
          hasParent0 && formBlock.type !== "group"
            ? getBlocksAsArray(store.getState(), parent0!.groups || [])
            : [];

        // immediate parent's parent
        const parent1 =
          parent0 && parent0.type === "group"
            ? parents[parents.length - 2]
            : null;
        const hasParent1 = !!parent1;

        if (hasParent1) {
          const parent1Groups =
            hasParent1 && formBlock.type !== "group"
              ? getBlocksAsArray(store.getState(), parent1!.groups || [])
              : [];
          return [parent1!].concat(parent1Groups);
        }

        return [parent0!].concat(parent0Groups);
      }
    }

    return [];
  };

  const onCompleteEditBlock = (values: any, options: IOperationFuncOptions) => {
    if (formType === "add-block-form") {
      const newBlock = { ...block, ...values };
      addBlockOperationFunc({ parent, user, block: newBlock }, options);
    } else {
      updateBlockOperationFunc({ block, data: values }, options);
    }
  };

  const renderBlockForm = () => {
    const formParents = getFormParents(block);
    const blockFormOperationId =
      formType === "add-block-form"
        ? OperationIDs.addBlock
        : OperationIDs.updateBlock;

    switch (block.type) {
      case "group":
        return (
          <GroupFormContainer
            operationID={blockFormOperationId}
            customId={block.customId}
            onClose={onClose}
            onSubmit={onCompleteEditBlock}
            initialValues={block}
            submitLabel={formLabel}
            possibleParents={formParents}
          />
        );

      case "task":
        return (
          <TaskFormContainer
            operationID={blockFormOperationId}
            customId={block.customId}
            onClose={onClose}
            onSubmit={onCompleteEditBlock}
            initialValues={block as any}
            user={user}
            submitLabel={formLabel}
            collaborators={collaborators}
            possibleParents={formParents}
          />
        );

      case "org":
        return (
          <EditOrgFormContainer
            onSubmit={onCompleteEditBlock}
            onClose={onClose}
            customId={block.customId}
            initialValues={block}
            operationID={blockFormOperationId}
            submitLabel={formLabel}
          />
        );

      case "project":
        return (
          <ProjectFormContainer
            customId={block.customId}
            initialValues={block}
            onClose={onClose}
            onSubmit={onCompleteEditBlock}
            operationID={blockFormOperationId}
            submitLabel={formLabel}
            possibleParents={formParents}
          />
        );
    }
  };

  const renderCollaboratorForm = () => {
    return (
      <AddCollaboratorFormContainer
        customId={block.customId}
        existingCollaborationRequests={requests}
        existingCollaborators={collaborators}
        onClose={onClose}
        onSubmit={(data, options) =>
          addCollaboratorsOperationFunc({ block, ...data }, options)
        }
        operationID={addCollaboratorsOperationID}
      />
    );
  };

  return (
    <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
      <StyledContainerAsH3 s={{ padding: "0 16px" }}>
        <StyledContainer s={{ flex: 1 }}>{formLabel}</StyledContainer>
        <StyledFlatButton style={{ color: "#ff4d4f" }} onClick={onClose}>
          Cancel
        </StyledFlatButton>
      </StyledContainerAsH3>
      {formType === "collaborator-form"
        ? renderCollaboratorForm()
        : renderBlockForm()}
    </StyledContainer>
  );
};

export default BlockForms;
