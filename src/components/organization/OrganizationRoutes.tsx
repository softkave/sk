import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import { appOrganizationPaths } from "../../models/app/routes";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import { AppDispatch } from "../../redux/types";
import Message from "../PageMessage";
import BoardContainer from "../board/BoardContainer";
import ChatRoomContainer from "../chat/ChatRoomContainer";
import useDeleteBoard from "./useDeleteBoard";
import useOrganizationReady from "./useOrganizationReady";

export interface IWorkspaceRoutesProps {}

const OrganizationRoutes: React.FC<IWorkspaceRoutesProps> = (props) => {
  const { organization } = useOrganizationReady();
  const dispatch = useDispatch<AppDispatch>();
  const { onDeleteBoard } = useDeleteBoard();
  const showOrgMenu = useSelector((state) =>
    KeyValueSelectors.getByKey(state as any, KeyValueKeys.ShowOrgMenu)
  ) as boolean;

  const toggleOrgMenu = React.useCallback(() => {
    dispatch(
      KeyValueActions.setValues({
        [KeyValueKeys.ShowAppMenu]: !showOrgMenu,
        [KeyValueKeys.ShowOrgMenu]: !showOrgMenu,
      })
    );
  }, [showOrgMenu, dispatch]);

  if (!organization) {
    return null;
  }

  const boardsRouteSelector = `${appOrganizationPaths.boards(organization.customId)}/:boardId`;

  const chatRouteSelector = `${appOrganizationPaths.chats(organization.customId)}/:recipientId`;

  const renderEmpty = () => <Message message={organization.name} />;
  return (
    <Switch>
      <Route
        path={boardsRouteSelector}
        render={(routeProps) => {
          return (
            <BoardContainer
              organizationId={organization.customId}
              boardId={routeProps.match.params.boardId!}
              isMobile={false}
              isAppMenuFolded={!showOrgMenu}
              onToggleFoldAppMenu={toggleOrgMenu}
              onClickDeleteBlock={onDeleteBoard}
            />
          );
        }}
      />
      <Route
        path={chatRouteSelector}
        render={(routeProps) => {
          const recipientId = routeProps.match.params.recipientId!;
          return <ChatRoomContainer orgId={organization.customId} recipientId={recipientId} />;
        }}
      />
      <Route path={appOrganizationPaths.organization(organization.customId)} render={renderEmpty} />
    </Switch>
  );
};

export default React.memo(OrganizationRoutes);
