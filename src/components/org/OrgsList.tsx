import { css } from "@emotion/css";
import { Divider, Space, Typography } from "antd";
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

const kMakeTextBlueClassName = "sk-orgslist-make-text-blue";

const OrgsList: React.FC<IOrgsListProps> = (props) => {
    const {
        orgs,
        requests,
        selectedId,
        unseenChatsCountMapByOrg,
        onClickBlock,
        onClickRequest,
    } = props;

    const requestStatusWeight: Record<
        CollaborationRequestStatusType,
        number
    > = {
        [CollaborationRequestStatusType.Pending]: 0,
        [CollaborationRequestStatusType.Accepted]: 1,
        [CollaborationRequestStatusType.Declined]: 2,
        [CollaborationRequestStatusType.Revoked]: 3,
        [CollaborationRequestStatusType.Expired]: 4,
    };

    const reqs = requests
        .sort((r1, r2) => {
            const s1 = getRequestStatus(r1);
            const s2 = getRequestStatus(r2);
            return requestStatusWeight[s1] - requestStatusWeight[s2];
        })
        .filter((r1) => {
            const s1 = getRequestStatus(r1);
            return s1 === CollaborationRequestStatusType.Pending;
        });

    if (orgs.length === 0 && requests.length === 0) {
        return (
            <EmptyMessage>Create an organization to get started</EmptyMessage>
        );
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

                    [`& .${kMakeTextBlueClassName} .ant-typography`]: {
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
    const hasOrgs = orgs.length > 0;
    const hasRequests = reqs.length > 0;

    const renderOrgs = () => {
        if (!hasOrgs) {
            return null;
        }

        return (
            <div>
                {orgs.map((org) =>
                    wrap(
                        org.customId,
                        <BlockThumbnail
                            block={org}
                            className={kMakeTextBlueClassName}
                            showFields={["name"]}
                            unseenChatsCount={
                                unseenChatsCountMapByOrg[org.customId]
                            }
                        />,
                        () => onClickBlock(org)
                    )
                )}
            </div>
        );
    };

    const renderRequests = () => {
        if (!hasRequests) {
            return null;
        }

        return (
            <div>
                {(isPrevGroupRendered =
                    isPrevGroupRendered || reqs.length > 0) && <Divider />}
                <Typography.Text
                    type="secondary"
                    style={{ padding: "0 16px", textTransform: "uppercase" }}
                >
                    Requests
                </Typography.Text>
                {reqs.map((request) =>
                    wrap(
                        request.customId,
                        <OrgCollaborationRequestThumbnail
                            collabRequest={request}
                        />,
                        () => onClickRequest(request)
                    )
                )}
            </div>
        );
    };

    return (
        <div
            className={css({
                display: "flex",
                flex: 1,
                height: "100%",
                width: "100%",
                flexDirection: "column",
            })}
        >
            {renderOrgs()}
            {renderRequests()}
        </div>
    );
};

export default React.memo(OrgsList);
