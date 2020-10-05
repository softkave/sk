import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import path from "path";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import { subscribe, unsubcribe } from "../../net/socket";
import BlockSelectors from "../../redux/blocks/selectors";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import {
    IUnseenChatsCountByOrg,
    KeyValueKeys,
} from "../../redux/key-value/types";
import OperationActions from "../../redux/operations/actions";
import { deleteBlockOperationAction } from "../../redux/operations/block/deleteBlock";
import { AppDispatch, IAppState } from "../../redux/types";
import confirmBlockDelete from "../block/confirmBlockDelete";
import GeneralErrorList from "../GeneralErrorList";
import useBlockParents from "../hooks/useBlockParents";
import { getOperationStats } from "../hooks/useOperation";
import RenderForDevice from "../RenderForDevice";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BoardForms, { BoardFormType } from "./BoardForms";
import OrgBoard from "./OrgBoard";
import { useLoadOrgData } from "./useLoadOrgData";
import { getBlockPath, getBlocksPath } from "./utils";

interface IBlockFormState {
    formType: BoardFormType;
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

const OrgBoardContainer: React.FC<{}> = () => {
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

    const showAppMenu = useSelector((state) =>
        KeyValueSelectors.getKey(state as any, KeyValueKeys.ShowAppMenu)
    ) as boolean;

    const showOrgMenu = useSelector((state) =>
        KeyValueSelectors.getKey(state as any, KeyValueKeys.ShowOrgMenu)
    ) as boolean;

    const unseenChatsCountMapByOrg = useSelector<
        IAppState,
        IUnseenChatsCountByOrg
    >((state) =>
        KeyValueSelectors.getKey(state, KeyValueKeys.UnseenChatsCountByOrg)
    );

    const toggleAppMenu = React.useCallback(() => {
        dispatch(
            KeyValueActions.setValues({
                [KeyValueKeys.ShowAppMenu]: !showAppMenu,
            })
        );
    }, [showAppMenu, dispatch]);

    const toggleOrgMenu = React.useCallback(() => {
        dispatch(
            KeyValueActions.setValues({
                [KeyValueKeys.ShowAppMenu]: !showOrgMenu,
                [KeyValueKeys.ShowOrgMenu]: !showOrgMenu,
            })
        );
    }, [showOrgMenu, dispatch]);

    const parents = useBlockParents(block);
    const parentPath = getBlocksPath(parents);

    // TODO: we need to rebuild the path when the user transfers the block
    const blockPath = getBlockPath(block, parentPath);
    const loadBoardDataStatusAndControls = useLoadOrgData(block);

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

    const onClickBlock = (blocks: IBlock[]) => {
        const nextPath = path.normalize(
            blockPath +
                "/" +
                blocks.map((b) => getBlockPath(b)).join("") +
                `/tasks`
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
                <BoardForms
                    orgId={block.rootBlockId || block.customId}
                    blockType={blockForm.blockType}
                    block={blockForm.block}
                    formType={blockForm.formType}
                    onClose={resetBlockForm}
                    parentBlock={blockForm.parentBlock!}
                />
            );
        }

        return null;
    };

    const renderBoardMain = (isMobile: boolean) => {
        return (
            <OrgBoard
                isMobile={isMobile}
                isAppMenuFolded={!showAppMenu}
                isOrgMenuFolded={!showOrgMenu}
                onToggleFoldAppMenu={toggleAppMenu}
                onToggleFoldOrgMenu={toggleOrgMenu}
                block={block}
                unseenChatsCount={unseenChatsCountMapByOrg[block.customId] || 0}
                blockPath={blockPath}
                onClickBlock={onClickBlock}
                onClickDeleteBlock={(blk) =>
                    confirmBlockDelete(blk, onDeleteBlock)
                }
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
        subscribe(block.type as any, block.customId);

        return () => {
            unsubcribe(block.type as any, block.customId);
        };
    }, [block.customId, block.type]);

    const render = () => {
        if (loadBoardDataStatusAndControls.loading) {
            return <LoadingEllipsis />;
        } else if (loadBoardDataStatusAndControls.errors) {
            return (
                <GeneralErrorList
                    fill
                    errors={loadBoardDataStatusAndControls.errors}
                />
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
