import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import path from "path";
import { URLSearchParams } from "url";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import subscribeEvent from "../../net/socket/outgoing/subscribeEvent";
import unsubcribeEvent from "../../net/socket/outgoing/unsubscribeEvent";
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
import AddCollaboratorFormInDrawer from "../collaborator/AddCollaboratorFormInDrawer";
import MessageList from "../MessageList";
import useBlockParents from "../hooks/useBlockParents";
import { getOpData } from "../hooks/useOperation";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import RenderForDevice from "../RenderForDevice";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BoardFormInDrawer from "./BoardFormInDrawer";
import OrgBoard from "./OrgBoard";
import { IBoardFormData } from "./types";
import { useLoadOrgData } from "./useLoadOrgData";
import { getBlockPath, getBlocksPath } from "./utils";
import { IBoard } from "../../models/board/types";
import {
  IAppOrganization,
  IOrganization,
} from "../../models/organization/types";
import OrganizationSelectors from "../../redux/organizations/selectors";

interface IRouteMatchParams {
  organizationId?: string;
}

// TODO: should forms have their own routes?
// TODO: should form labels be bold?

const OrgBoardContainer: React.FC<{}> = () => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const [boardForm, setBoardForm] = React.useState<
    { board: IBoard; organization?: IOrganization } | undefined
  >();

  const [organizationForm, setOrganizationForm] = React.useState<
    IAppOrganization | undefined
  >();

  const [showCollaboratorsForm, setShowCollaboratorsForm] =
    React.useState(false);

  const organizationPath = "/app/orgs/:organizationId";
  const selectedOrganizationRouteMatch =
    useRouteMatch<IRouteMatchParams>(organizationPath);

  const organizationId =
    selectedOrganizationRouteMatch &&
    selectedOrganizationRouteMatch.params.organizationId;

  const organization = useSelector<IAppState, IAppOrganization | undefined>(
    (state) => {
      if (organizationId) {
        return OrganizationSelectors.getOne(state, organizationId);
      }
    }
  )!;

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

  const parents = useBlockParents(organization.parent);
  const parentPath = getBlocksPath(parents);

  // TODO: we need to rebuild the path when the user transfers the block
  const blockPath = getBlockPath(organization, parentPath);
  const orgDataOp = useLoadOrgData(organization);

  const pushRoute = (route: string) => {
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
      blockPath + "/" + blocks.map((b) => getBlockPath(b)).join("") + `/tasks`
    );

    pushRoute(nextPath);
  };

  const onDeleteBlock = async (blockToDelete: IBlock) => {
    const result = await dispatch(
      deleteBlockOperationAction({ blockId: blockToDelete.customId })
    );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const opStat = getOpData(op);

    if (opStat.isCompleted) {
      message.success(`${blockToDelete.type} deleted successfully`);

      if (blockToDelete.customId === organization.customId) {
        pushRoute(parentPath);
      }
    } else if (opStat.isError) {
      message.error(`Error deleting ${blockToDelete.type}`);
    }

    dispatch(OperationActions.deleteOperation(op.id));
  };

  const closeBoardForm = () => {
    // TODO: prompt the user if the user has unsaved changes
    setBoardForm(undefined);
  };

  const closeOrganizationForm = () => {
    // TODO: prompt the user if the user has unsaved changes
    setOrganizationForm(undefined);
  };

  const renderBoardForm = () => {
    if (!boardForm) {
      return null;
    }

    return (
      <BoardFormInDrawer
        visible
        orgId={organization.customId}
        block={boardForm.board}
        onClose={closeBoardForm}
      />
    );
  };

  const renderOrganizationForm = () => {
    if (!organizationForm) {
      return null;
    }

    return (
      <EditOrgFormInDrawer
        visible
        organization={organizationForm}
        onClose={closeOrganizationForm}
      />
    );
  };

  const renderCollaboratorForm = () => {
    if (!showCollaboratorsForm) {
      return null;
    }

    return (
      <AddCollaboratorFormInDrawer
        visible
        orgId={organization.customId}
        onClose={() => setShowCollaboratorsForm(false)}
      />
    );
  };

  const renderBoardMain = (isMobile: boolean) => {
    return (
      <OrgBoard
        isMobile={isMobile}
        isAppMenuFolded={!showAppMenu}
        isOrgMenuFolded={!showOrgMenu}
        onToggleFoldAppMenu={toggleAppMenu}
        onToggleFoldOrgMenu={toggleOrgMenu}
        organization={organization}
        unseenChatsCount={unseenChatsCountMapByOrg[organization.customId] || 0}
        blockPath={blockPath}
        onClickBoard={onClickBlock}
        onClickDeleteBoard={(blk) => confirmBlockDelete(blk, onDeleteBlock)}
        onClickAddBoard={(organization, blockType) => {
          setBoardForm({
            organization,
            type: blockType,
          });
        }}
        onClickUpdateOrganization={(blockToUpdate) => {
          setBoardForm({
            type: blockToUpdate.type,
            block: blockToUpdate,
          });
        }}
        onAddCollaborator={() => setShowCollaboratorsForm(true)}
      />
    );
  };

  React.useEffect(() => {
    subscribeEvent([
      { type: organization.type as any, customId: organization.customId },
    ]);

    return () => {
      unsubcribeEvent([
        { type: organization.type as any, customId: organization.customId },
      ]);
    };
  }, [organization.customId, organization.type]);

  const render = () => {
    if (orgDataOp.loading) {
      return <LoadingEllipsis />;
    } else if (orgDataOp.errors) {
      return <MessageList fill messages={orgDataOp.errors} />;
    }

    return (
      <React.Fragment>
        {renderBoardForm()}
        {renderOrganizationForm()}
        {renderCollaboratorForm()}
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
