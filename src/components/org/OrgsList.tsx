import { Divider } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../../models/notification/notification";
import BlockThumbnail from "../block/BlockThumnail";
import { getRequestStatus } from "../collaborator/utils";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import OrgCollaborationRequestThumbnail from "./OrgCollaborationRequestThumbnail";

export interface IOrgsListProps {
    orgs: IBlock[];
    requests: INotification[];
    selectedId?: string;
    onClickBlock: (block: IBlock) => void;
    onClickRequest: (request: INotification) => void;
}

const OrgsList: React.FC<IOrgsListProps> = (props) => {
    const { orgs, requests, selectedId, onClickBlock, onClickRequest } = props;
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
        return (
            <StyledContainer
                key={key}
                s={{
                    padding: "8px 16px",
                    backgroundColor: selected ? "#bae7ff" : undefined,
                    cursor: "pointer",

                    "&:hover": {
                        backgroundColor: selected ? undefined : "#fafafa",
                    },

                    "& .ant-tag": {
                        cursor: "pointer",
                    },
                }}
                onClick={onClick}
            >
                {node}
            </StyledContainer>
        );
    };

    let isPrevGroupRendered = false;

    return (
        <React.Fragment>
            {pendingRequests.length > 0 &&
                pendingRequests.map((request) =>
                    wrap(
                        request.customId,
                        <OrgCollaborationRequestThumbnail
                            collabRequest={request}
                        />,
                        () => onClickRequest(request)
                    )
                )}
            {orgs.length > 0 && (
                <React.Fragment>
                    {(isPrevGroupRendered =
                        isPrevGroupRendered || pendingRequests.length > 0) && (
                        <Divider />
                    )}
                    {orgs.map((org) =>
                        wrap(
                            org.customId,
                            <BlockThumbnail
                                block={org}
                                showFields={["name"]}
                            />,
                            () => onClickBlock(org)
                        )
                    )}
                </React.Fragment>
            )}
            {expiredRequests.length > 0 && (
                <React.Fragment>
                    {(isPrevGroupRendered =
                        isPrevGroupRendered || orgs.length > 0) && <Divider />}
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
            )}
            {declinedRequests.length > 0 && (
                <React.Fragment>
                    {(isPrevGroupRendered =
                        isPrevGroupRendered || expiredRequests.length > 0) && (
                        <Divider />
                    )}
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
            )}
            {revokedRequests.length > 0 && (
                <React.Fragment>
                    {(isPrevGroupRendered =
                        isPrevGroupRendered || declinedRequests.length > 0) && (
                        <Divider />
                    )}
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
            )}
        </React.Fragment>
    );
};

export default React.memo(OrgsList);
