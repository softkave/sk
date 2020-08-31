import { LoadingOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, message, Typography } from "antd";
import React from "react";
import { ArrowLeft, X as CloseIcon } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../../models/notification/notification";
import { getNotification } from "../../redux/notifications/selectors";
import { respondToNotificationOperationAction } from "../../redux/operations/notification/respondToNotification";
import { AppDispatch, IAppState } from "../../redux/types";
import CollaborationRequestStatus from "../collaborator/CollaborationRequestStatus";
import { getRequestStatus } from "../collaborator/utils";
import EmptyMessage from "../EmptyMessage";
import FormError from "../form/FormError";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import { getFullBaseNavPath } from "../layout/path";
import StyledContainer from "../styled/Container";
import { INotificationsPathParams } from "./utils";

export interface INotificationProps {
    isMobile: boolean;
}

const Notification: React.FC<INotificationProps> = (props) => {
    const { isMobile } = props;
    const history = useHistory();
    const dispatch: AppDispatch = useDispatch();
    const routeMatch = useRouteMatch<INotificationsPathParams>(
        "/app/notifications/:notificationId"
    );
    const currentNotificationId =
        routeMatch && routeMatch.params
            ? routeMatch.params.notificationId
            : undefined;
    const notification = useSelector<IAppState, INotification | undefined>(
        (state) => getNotification(state, currentNotificationId!)
    );

    const opStatus = useOperation();

    const onBack = React.useCallback(() => {
        history.push("/app/notifications");
    }, [history]);

    if (!currentNotificationId) {
        history.push(getFullBaseNavPath());
        return null;
    }

    const isNotificationLoaded = !!notification;

    if (!isNotificationLoaded) {
        return <EmptyMessage>Notification not found</EmptyMessage>;
    }

    const onRespond = async (
        selectedResponse: CollaborationRequestStatusType
    ) => {
        const result = await dispatch(
            respondToNotificationOperationAction({
                response: selectedResponse,
                request: notification!,
                opId: opStatus.opId,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const currentOpStat = getOperationStats(op);

        if (currentOpStat.isCompleted) {
            message.success("Response sent successfully");
        } else if (currentOpStat.isError) {
            message.error("Error sending response");
        }
    };

    const renderNotificationResponse = () => {
        const status = getRequestStatus(notification!);

        if (status === CollaborationRequestStatusType.Pending) {
            const isResponseLoading = opStatus.isLoading;
            const responseError = opStatus.error;

            return (
                <React.Fragment>
                    {isResponseLoading && <LoadingOutlined />}
                    {responseError && <FormError error={responseError} />}
                    {!isResponseLoading && (
                        <Button.Group>
                            <Button
                                onClick={() =>
                                    onRespond(
                                        CollaborationRequestStatusType.Accepted
                                    )
                                }
                            >
                                Accept Request
                            </Button>
                            <Button
                                onClick={() =>
                                    onRespond(
                                        CollaborationRequestStatusType.Declined
                                    )
                                }
                            >
                                Decline Request
                            </Button>
                        </Button.Group>
                    )}
                </React.Fragment>
            );
        }

        return <CollaborationRequestStatus request={notification!} />;

        // if (response) {
        //     const hasRespondedToNotification =
        //         response.status === CollaborationRequestStatusType.Accepted ||
        //         response.status === CollaborationRequestStatusType.Declined;

        //     const isNotificationRevoked =
        //         response.status === CollaborationRequestStatusType.Revoked;

        //     return (
        //         <React.Fragment>
        //             {hasRespondedToNotification && (
        //                 <Typography.Paragraph>
        //                     You -{" "}
        //                     <Typography.Text strong>
        //                         {response.status}
        //                     </Typography.Text>
        //                 </Typography.Paragraph>
        //             )}
        //             {isNotificationRevoked && (
        //                 <Typography.Paragraph>
        //                     This request has been revoked
        //                 </Typography.Paragraph>
        //             )}
        //         </React.Fragment>
        //     );
        // } else if (notificationExpired) {
        //     return (
        //         <Typography.Paragraph>
        //             This request has expired
        //         </Typography.Paragraph>
        //     );
        // } else {
        //     const isResponseLoading = opStatus.isLoading;
        //     const responseError = opStatus.error;

        //     return (
        //         <React.Fragment>
        //             {isResponseLoading && <LoadingOutlined />}
        //             {responseError && <FormError error={responseError} />}
        //             {!isResponseLoading && (
        //                 <Button.Group>
        //                     <Button
        //                         onClick={() =>
        //                             onRespond(
        //                                 CollaborationRequestStatusType.Accepted
        //                             )
        //                         }
        //                     >
        //                         Accept Request
        //                     </Button>
        //                     <Button
        //                         onClick={() =>
        //                             onRespond(
        //                                 CollaborationRequestStatusType.Declined
        //                             )
        //                         }
        //                     >
        //                         Decline Request
        //                     </Button>
        //                 </Button.Group>
        //             )}
        //         </React.Fragment>
        //     );
        // }
    };

    const renderHeaderPrefixButton = () => {
        if (isMobile) {
            return (
                <StyledContainer s={{ marginRight: "16px", cursor: "pointer" }}>
                    <Button className="icon-btn" onClick={onBack}>
                        <ArrowLeft />
                    </Button>
                </StyledContainer>
            );
        } else {
            return (
                <StyledContainer
                    s={{ marginRight: "16px", cursor: "pointer" }}
                    onClick={onBack}
                >
                    <Button className="icon-btn" onClick={onBack}>
                        <CloseIcon />
                    </Button>
                </StyledContainer>
            );
        }
    };

    return (
        <StyledNotificationBody>
            <StyledNotificationBodyHead>
                <StyledContainer
                    s={{
                        marginRight: "16px",
                        cursor: "pointer",
                        alignItems: "center",
                    }}
                >
                    {renderHeaderPrefixButton()}
                </StyledContainer>
                <StyledContainer s={{ flex: 1, flexDirection: "column" }}>
                    <Typography.Title
                        level={1}
                        style={{ fontSize: "16px", marginBottom: "4px" }}
                    >
                        Collaboration Request From{" "}
                        {notification!.from!.blockName}
                    </Typography.Title>
                    <Typography.Text>
                        {new Date(notification!.createdAt).toDateString()}
                    </Typography.Text>
                </StyledContainer>
            </StyledNotificationBodyHead>
            <StyledMessage>{notification!.body}</StyledMessage>
            {renderNotificationResponse()}
        </StyledNotificationBody>
    );
};

export default Notification;

const StyledNotificationBody = styled.div({
    padding: "0 16px",
    height: "100%",
    width: "100%",
});

const StyledNotificationBodyHead = styled.div({
    marginBottom: "32px",
    display: "flex",
    marginTop: "16px",
});

const StyledMessage = styled.p({
    marginBottom: "32px",
});
