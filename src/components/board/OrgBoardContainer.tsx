import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import path from "path";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import BlockSelectors from "../../redux/blocks/selectors";
import OperationActions from "../../redux/operations/actions";
import { deleteBlockOperationAction } from "../../redux/operations/block/deleteBlock";
import { AppDispatch, IAppState } from "../../redux/types";
import { pluralize } from "../../utils/utils";
import confirmBlockDelete from "../block/confirmBlockDelete";
import GeneralErrorList from "../GeneralErrorList";
import useBlockParents from "../hooks/useBlockParents";
import { getOperationStats } from "../hooks/useOperation";
import RenderForDevice from "../RenderForDevice";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BlockContainer from "./BlockContainer";
import BlockForms, { BlockFormType } from "./BoardForms";
import LoadBlockChildren from "./LoadBlockChildren";
import OrgBoard from "./OrgBoard";
import { IBlockPathMatch } from "./types";
import { useBoardData } from "./useBoardData";
import { getDefaultBoardViewType } from "./utils";

interface IBlockFormState {
  formType: BlockFormType;
  orgId: string;
  blockType?: BlockType;
  parentBlock?: IBlock;
  block?: IBlock;
}

export interface IOrgBoardContainerProps {}

interface IRouteMatchParams {
  organizationId?: string;
}

// TODO: should forms have their own routes?
// TODO: should form labels be bold?

const OrgBoardContainer: React.FC<IOrgBoardContainerProps> = (props) => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const [blockForm, setBlockForm] = React.useState<IBlockFormState | null>(
    null
  );

  const organizationPath = "/app/organizations/:organizationId";
  const selectedOrganizationRouteMatch = useRouteMatch<IRouteMatchParams>(
    organizationPath
  );
  const organizationId =
    selectedOrganizationRouteMatch &&
    selectedOrganizationRouteMatch.params.organizationId;
  const block = useSelector<IAppState, IBlock | undefined>((state) => {
    if (organizationId) {
      return BlockSelectors.getBlock(state, organizationId);
    }
  })!;

  // if (!organization) {
  //   return (
  //     <StyledContainer s={{ alignItems: "center", justifyContent: "center" }}>
  //       <Empty description="Organization not found." />
  //     </StyledContainer>
  //   );
  // }

  const getPath = (b: IBlock) => {
    const bTypeFullName = getBlockTypeFullName(b.type);
    return `/${pluralize(bTypeFullName)}/${b.customId}`;
  };

  const parents = useBlockParents(block);
  const parentPath = `/app${parents.map(getPath).join("")}`;

  // TODO: we need to rebuild the path when the user transfers the block
  const blockPath = `${parentPath}${getPath(block)}`;
  const boardMatch = useRouteMatch<IBlockPathMatch>(
    `${blockPath}/boards/:blockId`
  );

  const boardDataOpStat = useBoardData(block);

  const pushRoute = (route) => {
    const search = new URLSearchParams(window.location.search);
    const routeURL = new URL(
      `${window.location.protocol}${window.location.host}${route}`
    );

    search.forEach((value, key) => {
      if (!routeURL.searchParams.get(key)) {
        routeURL.searchParams.set(key, value);
      }
    });

    const url = `${routeURL.pathname}${routeURL.search}`;
    history.push(url);
  };

  const onClickBlock = (blocks: IBlock[], searchParamKey = "bt") => {
    const clickedBlock = blocks[blocks.length - 1];
    const boardType = getDefaultBoardViewType(clickedBlock);
    const nextPath = path.normalize(
      blockPath +
        "/" +
        blocks.map((b) => getPath(b)).join("") +
        `/tasks?${searchParamKey}=${boardType}`
    );

    pushRoute(nextPath);
  };

  const onDeleteBlock = async (blockToDelete: IBlock) => {
    const result = await dispatch(
      deleteBlockOperationAction({ block: blockToDelete })
    );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const opStat = getOperationStats(op);

    if (opStat.isCompleted) {
      message.success(`${blockToDelete.type} deleted successfully`);

      if (blockToDelete.customId === block.customId) {
        pushRoute(parentPath);
      }

      dispatch(OperationActions.deleteOperation(op.id));
    } else if (opStat.isError) {
      message.error(`Error deleting ${blockToDelete.type}`);
    }
  };

  const resetBlockForm = () => {
    // TODO: prompt the user if she has unsaved changes
    setBlockForm(null);
  };

  const renderForms = () => {
    if (blockForm) {
      return (
        <BlockForms
          orgId={block.rootBlockId || block.customId}
          blockType={blockForm.blockType}
          block={blockForm.block}
          formType={blockForm.formType}
          onClose={resetBlockForm}
          parentBlock={blockForm.parentBlock}
        />
      );
    }

    return null;
  };

  const renderChild = () => {
    let boardId: string | null = null;

    if (boardMatch) {
      boardId = boardMatch.params.blockId;
    }

    if (boardId === null) {
      return null;
    }

    // TODO: this is an hack, find a better way to load
    return (
      <LoadBlockChildren
        parent={block}
        type={BlockType.Board}
        render={() => (
          <BlockContainer
            blockId={boardId!}
            notFoundMessage="Board not found"
          />
        )}
      />
    );
  };

  const renderBoardMain = (isMobile: boolean) => {
    return (
      <OrgBoard
        isMobile={isMobile}
        block={block}
        blockPath={blockPath}
        onClickBlock={onClickBlock}
        onClickDeleteBlock={(blk) => confirmBlockDelete(blk, onDeleteBlock)}
        onClickAddBlock={(parentBlock, blockType) => {
          setBlockForm({
            blockType,
            parentBlock,
            formType: "block-form",
            orgId: block.rootBlockId!,
          });
        }}
        onClickUpdateBlock={(blockToUpdate) =>
          setBlockForm({
            block: blockToUpdate,
            formType: "block-form",
            orgId: block.rootBlockId!,
            blockType: blockToUpdate.type,
          })
        }
        onClickAddCollaborator={() =>
          setBlockForm({
            block,
            formType: "collaborator-form",
            orgId: block.rootBlockId!,
          })
        }
        onClickAddOrEditLabel={() =>
          setBlockForm({
            block,
            formType: "label-list-form",
            orgId: block.rootBlockId!,
          })
        }
        onClickAddOrEditStatus={() =>
          setBlockForm({
            block,
            formType: "status-list-form",
            orgId: block.rootBlockId!,
          })
        }
      />
    );
  };

  const render = () => {
    if (boardDataOpStat.loading) {
      return <LoadingEllipsis />;
    } else if (boardDataOpStat.errors) {
      return <GeneralErrorList fill errors={boardDataOpStat.errors} />;
    }

    // if (boardMatch) {
    //   return renderChild();
    // }

    return (
      <React.Fragment>
        {renderForms()}
        <RenderForDevice
          renderForDesktop={() => renderBoardMain(false)}
          renderForMobile={() => renderBoardMain(true)}
        />
      </React.Fragment>
    );
  };

  return render();
};

export default OrgBoardContainer;
