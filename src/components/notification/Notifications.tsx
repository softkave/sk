import styled from "@emotion/styled";
import { Empty } from "antd";
import React from "react";
import Media from "react-media";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { INotification } from "../../models/notification/notification";
import { getNotifications } from "../../redux/notifications/selectors";
import { loadUserNotificationsOperationAction } from "../../redux/operations/notification/loadUserNotifications";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { newId } from "../../utils/utils";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import StyledContainer from "../styled/Container";
import theme from "../theme";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import Notification from "./Notification";
import NotificationList from "./NotificationList";
import { INotificationsPathParams } from "./utils";

const Notifications: React.FC<{}> = (props) => {
    const history = useHistory();
    const routeMatch = useRouteMatch()!;
    const dispatch: AppDispatch = useDispatch();
    const [opId] = React.useState(() => newId());
    const currentNotificationRouteMatch = useRouteMatch<
        INotificationsPathParams
    >("/app/notifications/:notificationId");
    const user = useSelector(SessionSelectors.getSignedInUserRequired);
    const notifications = useSelector<IAppState, INotification[]>((state) =>
        getNotifications(state, user.notifications || [])
    );
    const userHasNoNotifications = notifications.length === 0;
    const currentNotificationId =
        currentNotificationRouteMatch && currentNotificationRouteMatch.params
            ? currentNotificationRouteMatch.params.notificationId
            : undefined;

    const onClickNotification = (notification: INotification) => {
        history.push(`${routeMatch.url}/${notification.customId}`);
    };

    const loadNotifications = (helperProps: IUseOperationStatus) => {
        if (!helperProps.operation) {
            dispatch(loadUserNotificationsOperationAction({ opId }));
        }
    };

    const loadStatus = useOperation(
        {
            id: opId,
        },
        loadNotifications
    );

    const renderEmptyList = () => {
        return (
            <StyledContainer
                s={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Empty description="You currently have no notifications." />
            </StyledContainer>
        );
    };

    const renderNotificationList = () => {
        return (
            <NotificationList
                currentNotificationId={currentNotificationId}
                notifications={notifications}
                onClickNotification={onClickNotification}
            />
        );
    };

    const renderCurrentNotification = () => {
        return <Notification isMobile={false} />;
    };

    const renderCurrentNotificationForDesktop = () => {
        if (currentNotificationId) {
            return renderCurrentNotification();
        }

        return null;
    };

    const renderNotificationsForMobile = () => {
        if (currentNotificationId) {
            return renderCurrentNotification();
        } else {
            return renderNotificationList();
        }
    };

    const renderNotificationsForDesktop = () => {
        return (
            <StyledDesktopNotificationContainer>
                <StyledDesktopNotificationListContainer>
                    {renderNotificationList()}
                </StyledDesktopNotificationListContainer>
                <StyledDesktopNotificationBodyContainer>
                    {renderCurrentNotificationForDesktop()}
                </StyledDesktopNotificationBodyContainer>
            </StyledDesktopNotificationContainer>
        );
    };

    // TODO: Should we refactor this, it is used in multiple places?
    const render = () => {
        if (userHasNoNotifications) {
            return renderEmptyList();
        }

        return (
            <Media
                queries={{ mobile: `(max-width: ${theme.breakpoints.sm}px)` }}
            >
                {(matches) => (
                    <React.Fragment>
                        {matches.mobile && renderNotificationsForMobile()}
                        {!matches.mobile && renderNotificationsForDesktop()}
                    </React.Fragment>
                )}
            </Media>
        );
    };

    if (loadStatus.isLoading || !loadStatus.operation) {
        return <LoadingEllipsis />;
    } else if (loadStatus.isError) {
        return <GeneralErrorList fill errors={loadStatus.error} />;
    }

    return render();
};

export default Notifications;

// TODO: Global header for desktop
// TODO: Shadow header for mobile

const StyledDesktopNotificationContainer = styled.div({
    display: "flex",
    flex: 1,
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
});

const StyledDesktopNotificationBodyContainer = styled.div({
    display: "flex",
    flex: 1,
});

const StyledDesktopNotificationListContainer = styled.div({
    minWidth: "320px",
    borderRight: "1px solid #d9d9d9",
});
