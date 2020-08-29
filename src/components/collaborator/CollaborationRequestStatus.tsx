import { Tag } from "antd";
import React from "react";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../../models/notification/notification";
import { getRequestStatus } from "./utils";

const colorMap = {
    pending: "#EACA2C",
    accepted: "#7ED321",
    declined: "rgb(255, 77, 79)",
};

export interface ICollaborationRequestStatusProps {
    request: INotification;
}

const CollaborationRequestStatus: React.SFC<ICollaborationRequestStatusProps> = (
    props
) => {
    const { request } = props;
    const status = getRequestStatus(request);

    switch (status) {
        case CollaborationRequestStatusType.Expired:
            return <Tag color={colorMap.declined}>expired</Tag>;

        case CollaborationRequestStatusType.Accepted:
            return <Tag color={colorMap.accepted}>accepted</Tag>;

        case CollaborationRequestStatusType.Declined:
            return <Tag color={colorMap.declined}>declined</Tag>;

        case CollaborationRequestStatusType.Pending:
            return <Tag color={colorMap.pending}>pending</Tag>;

        case CollaborationRequestStatusType.Revoked:
            return <Tag color={colorMap.declined}>revoked</Tag>;

        default:
            return null;
    }
};

export default React.memo(CollaborationRequestStatus);
