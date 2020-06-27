import { createReducer } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import UserActions from "./actions";
import { IUsersState } from "./types";

const usersReducer = createReducer<IUsersState>({}, (builder) => {
  builder.addCase(UserActions.addUser, (state, action) => {
    if (state[action.payload.customId]) {
      state[action.payload.customId] = merge(
        state[action.payload.customId],
        action.payload
      );
    } else {
      state[action.payload.customId] = action.payload;
    }
  });

  builder.addCase(UserActions.updateUser, (state, action) => {
    state[action.payload.id] = mergeData(
      state[action.payload.id],
      action.payload.data,
      action.payload.meta
    );
  });

  builder.addCase(UserActions.deleteUser, (state, action) => {
    delete state[action.payload];
  });

  builder.addCase(UserActions.bulkAddUsers, (state, action) => {
    action.payload.forEach((user) => {
      if (state[user.customId]) {
        state[user.customId] = merge(state[user.customId], user);
      } else {
        state[user.customId] = user;
      }
    });
  });

  builder.addCase(UserActions.bulkUpdateUsers, (state, action) => {
    action.payload.forEach((param) => {
      state[param.id] = mergeData(state[param.id], param.data, param.meta);
    });
  });

  builder.addCase(UserActions.bulkDeleteUsers, (state, action) => {
    action.payload.forEach((id) => delete state[id]);
  });

  builder.addCase(SessionActions.logoutUser, (state) => {
    state = {};
  });
});

export default usersReducer;
