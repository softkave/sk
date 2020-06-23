import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import NotificationActions from "./actions";
import { INotificationsState } from "./types";

const notificationsReducer = createReducer<INotificationsState>(
  {},
  (builder) => {
    builder.addCase(NotificationActions.addNotification, (state, action) => {
      state[action.payload.customId] = action.payload;
    });

    builder.addCase(NotificationActions.updateNotification, (state, action) => {
      state[action.payload.id] = mergeData(
        state[action.payload.id],
        action.payload.data,
        action.payload.meta
      );
    });

    builder.addCase(NotificationActions.deleteNotification, (state, action) => {
      delete state[action.payload];
    });

    builder.addCase(
      NotificationActions.bulkAddNotifications,
      (state, action) => {
        action.payload.forEach(
          (notification) => (state[notification.customId] = notification)
        );
      }
    );

    builder.addCase(
      NotificationActions.bulkUpdateNotifications,
      (state, action) => {
        action.payload.forEach((param) => {
          state[param.id] = mergeData(state[param.id], param.data, param.meta);
        });
      }
    );

    builder.addCase(
      NotificationActions.bulkDeleteNotifications,
      (state, action) => {
        action.payload.forEach((id) => delete state[id]);
      }
    );

    builder.addCase(SessionActions.logoutUser, (state) => {
      state = {};
    });
  }
);

export default notificationsReducer;
