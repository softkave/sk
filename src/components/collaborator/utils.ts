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

    if (expired) {
        return CollaborationRequestStatusType.Expired;
    }

    const statusHistory = request.statusHistory || [];
    const latestStatus = statusHistory[statusHistory.length - 1];
    return latestStatus.status;
};
