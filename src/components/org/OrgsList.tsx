import { Divider } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../../models/notification/notification";
import { IUnseenChatsCountByOrg } from "../../redux/key-value/types";
import BlockThumbnail from "../block/BlockThumnail";
import { getRequestStatus } from "../collaborator/utils";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import OrgCollaborationRequestThumbnail from "./OrgCollaborationRequestThumbnail";

export interface IOrgsListProps {
    orgs: IBlock[];
    requests: INotification[];
    unseenChatsCountMapByOrg: IUnseenChatsCountByOrg;
    selectedId?: string;
    onClickBlock: (block: IBlock) => void;
    onClickRequest: (request: INotification) => void;
}

const OrgsList: React.FC<IOrgsListProps> = (props) => {
    const {
        orgs,
        requests,
        selectedId,
        unseenChatsCountMapByOrg,
        onClickBlock,
        onClickRequest,
    } = props;

    const pendingRequests: INotification[] = [];
    const expiredRequests: INotification[] = [];
    const declinedRequests: INotification[] = [];
    const revokedRequests: INotification[] = [];

    requests.forEach((request) => {
        const status = getRequestStatus(request);

        switch (status) {
            case CollaborationRequestStatusType.Accepted:
                return;

            case CollaborationRequestStatusType.Pending:
                pendingRequests.push(request);
                break;

            case CollaborationRequestStatusType.Expired:
                expiredRequests.push(request);
                break;

            case CollaborationRequestStatusType.Declined:
                declinedRequests.push(request);
                break;

            case CollaborationRequestStatusType.Revoked:
                revokedRequests.push(request);
                break;
        }
    });

    if (orgs.length === 0 && requests.length === 0) {
        return <EmptyMessage>Nothing here yet</EmptyMessage>;
    }

    const wrap = (key: string, node: React.ReactNode, onClick: any) => {
        const selected = selectedId === key;
        let color: string | undefined;
        let backgroundColor: string | undefined;

        if (selected) {
            color = "#1890ff";
            backgroundColor = "#e6f7ff";
        }

        return (
            <StyledContainer
                key={key}
                s={{
                    color,
                    backgroundColor,
                    padding: "8px 16px",
                    cursor: "pointer",

                    "&:hover": {
                        backgroundColor,
                    },

                    "& .ant-tag": {
                        cursor: "pointer",
                    },

                    "& .ant-typography": {
                        color,
                    },
                }}
                onClick={onClick}
            >
                {node}
            </StyledContainer>
        );
    };

    let isPrevGroupRendered = false;
    const hasPendingRequests = pendingRequests.length > 0;
    const hasOrgs = orgs.length > 0;
    const hasExpiredRequests = expiredRequests.length > 0;
    const hasDeclinedRequests = declinedRequests.length > 0;
    const hasRevokedRequests = revokedRequests.length > 0;

    const renderPendingRequests = () => {
        if (!hasPendingRequests) {
            return null;
        }

        return (
            <React.Fragment>
                {/* <Typography.Text style={{ padding: "0 16px" }}>
                    Pending Requests
                </Typography.Text> */}
                {pendingRequests.map((request) =>
                    wrap(
                        request.customId,
                        <OrgCollaborationRequestThumbnail
                            collabRequest={request}
                        />,
                        () => onClickRequest(request)
                    )
                )}
            </React.Fragment>
        );
    };

    const renderOrgs = () => {
        if (!hasOrgs) {
            return null;
        }

        return (
            <React.Fragment>
                {(isPrevGroupRendered =
                    isPrevGroupRendered || pendingRequests.length > 0) && (
                    <Divider />
                )}
                {/* <Typography.Text style={{ padding: "0 16px" }}>
                    Orgs
                </Typography.Text> */}
                {orgs.map((org) =>
                    wrap(
                        org.customId,
                        <BlockThumbnail
                            block={org}
                            showFields={["name"]}
                            unseenChatsCount={
                                unseenChatsCountMapByOrg[org.customId]
                            }
                        />,
                        () => onClickBlock(org)
                    )
                )}
            </React.Fragment>
        );
    };

    const renderExpiredRequests = () => {
        if (!hasExpiredRequests) {
            return null;
        }

        return (
            <React.Fragment>
                {(isPrevGroupRendered =
                    isPrevGroupRendered || orgs.length > 0) && <Divider />}
                {/* <Typography.Text style={{ padding: "0 16px" }}>
                    Expired Requests
                </Typography.Text> */}
                {expiredRequests.map((request) =>
                    wrap(
                        request.customId,
                        <OrgCollaborationRequestThumbnail
                            collabRequest={request}
                        />,
                        () => onClickRequest(request)
                    )
                )}
            </React.Fragment>
        );
    };

    const renderDeclinedRequests = () => {
        if (!hasDeclinedRequests) {
            return null;
        }

        return (
            <React.Fragment>
                {(isPrevGroupRendered =
                    isPrevGroupRendered || expiredRequests.length > 0) && (
                    <Divider />
                )}
                {/* <Typography.Text style={{ padding: "0 16px" }}>
                    Declined Requests
                </Typography.Text> */}
                {declinedRequests.map((request) =>
                    wrap(
                        request.customId,
                        <OrgCollaborationRequestThumbnail
                            collabRequest={request}
                        />,
                        () => onClickRequest(request)
                    )
                )}
            </React.Fragment>
        );
    };

    const renderRevokedRequests = () => {
        if (!hasRevokedRequests) {
            return null;
        }

        return (
            <React.Fragment>
                {(isPrevGroupRendered =
                    isPrevGroupRendered || declinedRequests.length > 0) && (
                    <Divider />
                )}
                {/* <Typography.Text style={{ padding: "0 16px" }}>
                    Revoked Requests
                </Typography.Text> */}
                {revokedRequests.map((request) =>
                    wrap(
                        request.customId,
                        <OrgCollaborationRequestThumbnail
                            collabRequest={request}
                        />,
                        () => onClickRequest(request)
                    )
                )}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {renderPendingRequests()}
            {renderOrgs()}
            {renderExpiredRequests()}
            {renderDeclinedRequests()}
            {renderRevokedRequests()}
        </React.Fragment>
    );
};

export default React.memo(OrgsList);
