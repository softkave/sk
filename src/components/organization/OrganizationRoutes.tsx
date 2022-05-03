import React from "react";
import { Route, Switch } from "react-router";
import Message from "../Message";
import BoardContainer from "../board/BoardContainer";
import { appOrganizationRoutes } from "../../models/organization/utils";
import ChatRoomContainer from "../chat/ChatRoomContainer";
import useDeleteBoard from "./useDeleteBoard";
import { useDispatch, useSelector } from "react-redux";
import KeyValueActions from "../../redux/key-value/actions";
import { KeyValueKeys } from "../../redux/key-value/types";
import { AppDispatch } from "../../redux/types";
import KeyValueSelectors from "../../redux/key-value/selectors";
import useOrganizationReady from "./useOrganizationReady";

export interface IOrganizationRoutesProps {}

const OrganizationRoutes: React.FC<IOrganizationRoutesProps> = (props) => {
  const { organization } = useOrganizationReady();
  const dispatch = useDispatch<AppDispatch>();
  const { onDeleteBoard } = useDeleteBoard();
  const showOrgMenu = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.ShowOrgMenu)
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

  const boardsRouteSelector = `${appOrganizationRoutes.boards(
    organization.customId
  )}/:boardId`;

  const chatRouteSelector = `${appOrganizationRoutes.chats(
    organization.customId
  )}/:recipientId`;

  const renderEmpty = () => <Message message={organization.name} />;
  return (
    <Switch>
      <Route
        path={boardsRouteSelector}
        render={(routeProps) => {
          return (
            <BoardContainer
              boardId={routeProps.match.params.boardId}
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
          const recipientId = routeProps.match.params.recipientId;
          return (
            <ChatRoomContainer
              orgId={organization.customId}
              recipientId={recipientId}
            />
          );
        }}
      />
      <Route
        path={appOrganizationRoutes.organization(organization.customId)}
        render={renderEmpty}
      />
    </Switch>
  );
};

export default React.memo(OrganizationRoutes);
