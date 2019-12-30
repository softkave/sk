import React from "react";
import { useSelector, useStore } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import OperationIDs from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import GroupFormContainer from "../group/GroupFormContainer";
import useBlockParents from "../hooks/useBlockParent";
import EditOrgFormContainer from "../org/EditOrgFormContainer";
import ProjectFormContainer from "../project/ProjectFormContainer";
import StyledContainer from "../styled/Container";
import StyledCapitalizeText from "../StyledCapitalizeText";
import TaskFormContainer from "../task/TaskFormContainer";

export type BlockFormType = "add-block-form" | "update-block-form";

export interface IBlockFormsProps {
  block: IBlock;
  formType: BlockFormType;
  onClose: () => void;
}

const BlockForms: React.FC<IBlockFormsProps> = props => {
  const { block, formType, onClose } = props;
  const store = useStore();
  const parents = useBlockParents(block);
  const user = useSelector(getSignedInUserRequired);
  const hasCollaborators = block.type === "org";
  const organizationID = hasCollaborators ? block.customId : block.parents![0];
  const organization = useSelector<IReduxState, IBlock>(
    state => getBlock(state, organizationID)!
  );
  const collaboratorIDs = Array.isArray(organization.collaborators)
    ? organization.collaborators
    : [];
  const collaborators = useSelector<IReduxState, IUser[]>(state =>
    getUsersAsArray(state, collaboratorIDs)
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
      addBlockOperationFunc({ user, block: newBlock, parent: block }, options);
    } else {
      updateBlockOperationFunc({ block, data: values }, options);
    }
  };

  const blockFormTypeFullName = getBlockTypeFullName(block.type);
  const blockFormOperationId =
    formType === "add-block-form"
      ? OperationIDs.addBlock
      : OperationIDs.updateBlock;

  const formLabel = (
    <StyledCapitalizeText>
      {formType} {blockFormTypeFullName}
    </StyledCapitalizeText>
  );

  const formParents = getFormParents(block);

  return (
    <StyledContainer s={{ flexDirection: "column" }}>
      <h3 style={{ padding: "0 24px" }}>{formLabel}</h3>
      {block.type === "project" && (
        <ProjectFormContainer
          customId={block.customId}
          initialValues={block}
          onClose={onClose}
          onSubmit={onCompleteEditBlock}
          operationID={blockFormOperationId}
          submitLabel={formLabel}
          parents={formParents}
        />
      )}
      {block.type === "group" && (
        <GroupFormContainer
          operationID={blockFormOperationId}
          customId={block.customId}
          onClose={onClose}
          onSubmit={onCompleteEditBlock}
          initialValues={block}
          submitLabel={formLabel}
          parents={formParents}
        />
      )}
      {block.type === "task" && (
        <TaskFormContainer
          operationID={blockFormOperationId}
          customId={block.customId}
          onClose={onClose}
          onSubmit={onCompleteEditBlock}
          initialValues={block as any}
          user={user}
          submitLabel={formLabel}
          collaborators={collaborators}
          parents={formParents}
        />
      )}
      {block.type === "org" && (
        <EditOrgFormContainer
          onSubmit={onCompleteEditBlock}
          onClose={onClose}
          customId={block.customId}
          initialValues={block}
          operationID={blockFormOperationId}
          submitLabel={formLabel}
        />
      )}
    </StyledContainer>
  );
};

export default BlockForms;
