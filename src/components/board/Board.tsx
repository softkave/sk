import path from "path";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import { pluralize } from "../../utils/utils";
import confirmBlockDelete from "../block/confirmBlockDelete";
import GeneralErrorList from "../GeneralErrorList";
import useBlockParents from "../hooks/useBlockParents";
import RenderForDevice from "../RenderForDevice";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BlockContainer from "./BlockContainer";
import BlockForms, { BlockFormType } from "./BoardForms";
import BoardMain from "./BoardMain";
import { l } from "./data-loaders/loadBoardData";
import { IBlockPathMatch } from "./types";
import { getDefaultBoardViewType } from "./utils";

interface IBlockFormState {
  formType: BlockFormType;
  orgId: string;
  blockType?: BlockType;
  parentBlock?: IBlock;
  block?: IBlock;
}

export interface IBoardForBlockProps {
  block: IBlock;
}

// TODO: should forms have their own routes?
// TODO: should form labels be bold?

const Board: React.FC<IBoardForBlockProps> = (props) => {
  const { block } = props;
  const history = useHistory();
  const [blockForm, setBlockForm] = React.useState<IBlockFormState | null>(
    null
  );

  const getPath = (b: IBlock) => {
    const bTypeFullName = getBlockTypeFullName(b.type);
    return `/${pluralize(bTypeFullName)}/${b.customId}`;
  };

  const parents = useBlockParents(block);
  const parentPath = `/app${parents.map(getPath).join("")}`;

  // TODO: we need to rebuild the path when the user transfers the block
  const blockPath = `${parentPath}${getPath(block)}`;
  const boardMatch = useRouteMatch<IBlockPathMatch>(
    `${blockPath}/boards/:blockID`
  );

  const lop = l(block);

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

  const onDeleteBlock = (blockToDelete: IBlock) => {
    deleteBlockOperationFunc({ block: blockToDelete });

    // TODO: wait for block to complete deleting before pushing
    if (blockToDelete.customId === block.customId) {
      pushRoute(parentPath);
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
          orgID={block.rootBlockId || block.customId}
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
    let childId: string | null = null;

    if (boardMatch) {
      childId = boardMatch.params.blockId;
    }

    if (childId === null) {
      return null;
    }

    return (
      <BlockContainer blockID={childId!} notFoundMessage="Board not found" />
    );
  };

  const renderBoardMain = (isMobile: boolean) => {
    return (
      <BoardMain
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
    if (lop.loading) {
      return <LoadingEllipsis />;
    } else if (lop.errors) {
      return <GeneralErrorList fill errors={lop.errors} />;
    }

    if (boardMatch) {
      return renderChild();
    }

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

export default Board;
