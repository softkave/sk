import moment from "moment";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../../models/notification/notification";

export const getRequestStatus = (
    request: INotification
): CollaborationRequestStatusType => {
    const expiresAt = moment(request.expiresAt);
    const expired = request.expiresAt && moment().isAfter(expiresAt);
    const statusHistory = request.statusHistory || [];
    const latestStatus = statusHistory[statusHistory.length - 1];

    if (latestStatus.status === CollaborationRequestStatusType.Accepted) {
        return latestStatus.status;
    }

    if (expired) {
        return CollaborationRequestStatusType.Expired;
    }

    return latestStatus.status;
};
