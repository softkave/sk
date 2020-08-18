import { unwrapResult } from "@reduxjs/toolkit";
import { Button, message, notification, Space } from "antd";
import path from "path";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import { subscribeToBlock, unsubcribeFromBlock } from "../../net/socket";
import BlockSelectors from "../../redux/blocks/selectors";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import OperationActions from "../../redux/operations/actions";
import { deleteBlockOperationAction } from "../../redux/operations/block/deleteBlock";
import { AppDispatch, IAppState } from "../../redux/types";
import { newId } from "../../utils/utils";
import confirmBlockDelete from "../block/confirmBlockDelete";
import GeneralErrorList from "../GeneralErrorList";
import useBlockParents from "../hooks/useBlockParents";
import { getOperationStats } from "../hooks/useOperation";
import RenderForDevice from "../RenderForDevice";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BlockForms, { BlockFormType } from "./BoardForms";
import OrgBoard from "./OrgBoard";
import { useBoardData } from "./useBoardData";
import { getBlockPath, getBlocksPath, getDefaultBoardViewType } from "./utils";

interface IBlockFormState {
  formType: BlockFormType;
  orgId: string;
  blockType?: BlockType;
  parentBlock?: IBlock;
  block?: IBlock;
}

interface IRouteMatchParams {
  organizationId?: string;
}

// TODO: should forms have their own routes?
// TODO: should form labels be bold?

const OrgBoardContainer: React.FC<{}> = (props) => {
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

  const reloadBoard = useSelector<IAppState, boolean>(
    (state) => !!KeyValueSelectors.getKey(state, KeyValueKeys.ReloadBoard)
  );

  const showAppMenu = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.AppMenu)
  ) as boolean;

  const showOrgMenu = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.OrgMenu)
  ) as boolean;

  const toggleAppMenu = React.useCallback(() => {
    dispatch(
      KeyValueActions.setValues({
        [KeyValueKeys.AppMenu]: !showAppMenu,
      })
    );
  }, [showAppMenu, dispatch]);

  const toggleOrgMenu = React.useCallback(() => {
    dispatch(
      KeyValueActions.setValues({
        [KeyValueKeys.AppMenu]: !showOrgMenu,
        [KeyValueKeys.OrgMenu]: !showOrgMenu,
      })
    );
  }, [showOrgMenu, dispatch]);

  const parents = useBlockParents(block);
  const parentPath = getBlocksPath(parents);

  // TODO: we need to rebuild the path when the user transfers the block
  const blockPath = getBlockPath(block, parentPath);
  const loadBoardDataStatusAndControls = useBoardData(block);

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
        blocks.map((b) => getBlockPath(b)).join("") +
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

  const renderBoardMain = (isMobile: boolean) => {
    // return null;
    return (
      <OrgBoard
        isMobile={isMobile}
        isAppMenuFolded={!showAppMenu}
        isOrgMenuFolded={!showOrgMenu}
        onToggleFoldAppMenu={toggleAppMenu}
        onToggleFoldOrgMenu={toggleOrgMenu}
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

  React.useEffect(() => {
    console.log(block.type);
    subscribeToBlock(block.customId);
    // const key = newId();
    // notification.open({
    //   key,
    //   duration: 0,
    //   message: "Board updated",
    //   description: (
    //     <Space direction="vertical">
    //       <div>Reload to see latest changes</div>
    //       <Button
    //         onClick={() => {
    //           notification.close(key);
    //           loadBoardDataStatusAndControls.reload();
    //         }}
    //       >
    //         Reload
    //       </Button>
    //     </Space>
    //   ),
    // });

    return () => {
      unsubcribeFromBlock(block.customId);
    };
  }, [block.customId]);

  React.useEffect(() => {
    if (reloadBoard) {
      // TODO: show reload board notification
      const key = newId();
      notification.open({
        key,
        duration: 0,
        message: "Board updated",
        description: (
          <Space direction="vertical">
            <div>Reload to see latest changes</div>
            <Button
              onClick={() => {
                notification.close(key);
                loadBoardDataStatusAndControls.reload();
              }}
            >
              Reload
            </Button>
          </Space>
        ),
      });
      dispatch(
        KeyValueActions.setKey({ key: KeyValueKeys.ReloadBoard, value: false })
      );
    }
  }, [reloadBoard]);

  const render = () => {
    if (loadBoardDataStatusAndControls.loading) {
      return <LoadingEllipsis />;
    } else if (loadBoardDataStatusAndControls.errors) {
      return (
        <GeneralErrorList fill errors={loadBoardDataStatusAndControls.errors} />
      );
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

export default OrgBoardContainer;
