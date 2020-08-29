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
                s={{
                    padding: "8px 16px",
                    backgroundColor: selected ? "#bae7ff" : undefined,

                    "&:hover": {
                        backgroundColor: selected ? undefined : "#fafafa",
                    },
                }}
                onClick={onClick}
            >
                {node}
            </StyledContainer>
        );
    };

    return (
        <React.Fragment>
            {pendingRequests.length &&
                pendingRequests.map((request) =>
                    wrap(
                        request.customId,
                        <OrgCollaborationRequestThumbnail
                            collabRequest={request}
                        />,
                        () => onClickRequest(request)
                    )
                )}
            {orgs.length && (
                <React.Fragment>
                    <Divider />
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
            {expiredRequests.length && (
                <React.Fragment>
                    <Divider />
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
            {declinedRequests.length && (
                <React.Fragment>
                    <Divider />
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
            {revokedRequests.length && (
                <React.Fragment>
                    <Divider />
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
