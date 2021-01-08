import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import blocksReducer from "./blocks/reducer";
import commentsReducer from "./comments/reducer";
import keyValueReducer from "./key-value/reducer";
import notificationsReducer from "./notifications/reducer";
import operationsReducer from "./operations/reducer";
import roomsReducer from "./rooms/reducer";
import sessionReducer from "./session/reducer";
import sprintsReducer from "./sprints/reducer";
import usersReducer from "./users/reducer";

const reducer = combineReducers({
    blocks: blocksReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    session: sessionReducer,
    operations: operationsReducer,
    keyValue: keyValueReducer,
    rooms: roomsReducer,
    sprints: sprintsReducer,
    permissions: () => ({}),
    permissionGroups: () => ({}),
    userAssignedPermissionGroups: () => ({}),
    comments: commentsReducer,
});

const store = configureStore({
    reducer,
});

export default store;
