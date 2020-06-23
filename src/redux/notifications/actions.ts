import { createAction } from "@reduxjs/toolkit";
import { INotification } from "../../models/notification/notification";
import { IMergeDataMeta } from "../../utils/utils";

const addNotification = createAction<INotification>(
  "notifications/addNotification"
);

const updateNotification = createAction<{
  id: string;
  data: Partial<INotification>;
  meta?: IMergeDataMeta;
}>("notifications/updateNotification");

const deleteNotification = createAction<string>(
  "notifications/deleteNotification"
);

const bulkAddNotifications = createAction<INotification[]>(
  "notifications/bulkAddNotifications"
);

const bulkUpdateNotifications = createAction<
  Array<{ id: string; data: Partial<INotification>; meta?: IMergeDataMeta }>
>("notifications/bulkUpdateNotifications");

const bulkDeleteNotifications = createAction<string[]>(
  "notifications/bulkDeleteNotifications"
);

class NotificationActions {
  public static addNotification = addNotification;
  public static updateNotification = updateNotification;
  public static deleteNotification = deleteNotification;
  public static bulkAddNotifications = bulkAddNotifications;
  public static bulkUpdateNotifications = bulkUpdateNotifications;
  public static bulkDeleteNotifications = bulkDeleteNotifications;
}

export default NotificationActions;
