import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import path from "path";
import { URLSearchParams } from "url";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import subscribeEvent from "../../net/socket/outgoing/subscribeEvent";
import unsubcribeEvent from "../../net/socket/outgoing/unsubscribeEvent";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import {
  IUnseenChatsCountByOrg,
  KeyValueKeys,
} from "../../redux/key-value/types";
import { AppDispatch, IAppState } from "../../redux/types";
import confirmBlockDelete from "../block/confirmBlockDelete";
import AddCollaboratorFormInDrawer from "../collaborator/AddCollaboratorFormInDrawer";
import MessageList from "../MessageList";
import { getOpData } from "../hooks/useOperation";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import RenderForDevice from "../RenderForDevice";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BoardFormInDrawer from "./BoardFormInDrawer";
import Organization from "./Organization";
import { useLoadOrgData } from "./useLoadOrgData";
import { IBoard } from "../../models/board/types";
import { IAppOrganization } from "../../models/organization/types";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { appBoardRoutes } from "../../models/board/utils";
import { deleteBoardOpAction } from "../../redux/operations/board/deleteBoard";
import { appLoggedInPaths } from "../../models/app/routes";

interface IRouteMatchParams {
  organizationId?: string;
}

// TODO: should forms have their own routes?
// TODO: should form labels be bold?

const OrganizationContainer: React.FC<{}> = () => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const [boardForm, setBoardForm] = React.useState<
    { board?: IBoard } | undefined
  >();

  const [organizationForm, setOrganizationForm] = React.useState(false);
  const [showCollaboratorsForm, setShowCollaboratorsForm] =
    React.useState(false);

  const organizationPath = `${appLoggedInPaths.organizations}/:organizationId`;
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

  const orgDataOp = useLoadOrgData(organization);
  const pushRoute = React.useCallback(
    (route: string) => {
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
    },
    [history]
  );

  const onClickBoard = React.useCallback(
    (board: IBoard) => {
      const nextPath = path.normalize(
        appBoardRoutes.tasks(organization.customId, board.customId)
      );

      pushRoute(nextPath);
    },
    [organization.customId, pushRoute]
  );

  const deleteBoard = React.useCallback(
    async (board: IBoard) => {
      const result = await dispatch(
        deleteBoardOpAction({
          boardId: board.customId,
          deleteOpOnComplete: true,
        })
      );

      const op = unwrapResult(result);

      if (!op) {
        return;
      }

      const opStat = getOpData(op);

      if (opStat.isCompleted) {
        message.success("Board deleted.");
      } else if (opStat.isError) {
        message.error("Error deleting board.");
      }
    },
    [dispatch]
  );

  const onDeleteBoard = React.useCallback(
    (board: IBoard) => {
      confirmBlockDelete(board, deleteBoard);
    },
    [deleteBoard]
  );

  const openBoardForm = React.useCallback((board?: IBoard) => {
    setBoardForm({ board });
  }, []);

  const openOrganizationForm = React.useCallback(() => {
    setOrganizationForm(true);
  }, []);

  const openCollaboratorForm = React.useCallback(() => {
    setOrganizationForm(true);
  }, []);

  const closeBoardForm = React.useCallback(() => {
    // TODO: prompt the user if the user has unsaved changes
    setBoardForm(undefined);
  }, []);

  const closeOrganizationForm = React.useCallback(() => {
    // TODO: prompt the user if the user has unsaved changes
    setOrganizationForm(false);
  }, []);

  const renderBoardForm = () => {
    if (!boardForm) {
      return null;
    }

    return (
      <BoardFormInDrawer
        visible
        orgId={organization.customId}
        board={boardForm.board}
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
        organization={organization}
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
      <Organization
        isMobile={isMobile}
        isAppMenuFolded={!showAppMenu}
        isOrgMenuFolded={!showOrgMenu}
        onToggleFoldAppMenu={toggleAppMenu}
        onToggleFoldOrgMenu={toggleOrgMenu}
        organization={organization}
        unseenChatsCount={unseenChatsCountMapByOrg[organization.customId] || 0}
        onClickBoard={onClickBoard}
        onClickDeleteBoard={onDeleteBoard}
        onClickAddBoard={openBoardForm}
        onClickUpdateOrganization={openOrganizationForm}
        onAddCollaborator={openCollaboratorForm}
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

export default OrganizationContainer;
