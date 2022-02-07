import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import boardsReducer from "./boards/reducer";
import collaborationRequestsReducer from "./collaborationRequests/reducer";
import commentsReducer from "./comments/reducer";
import keyValueReducer from "./key-value/reducer";
import operationsReducer from "./operations/reducer";
import organizationsReducer from "./organizations/reducer";
import roomsReducer from "./rooms/reducer";
import sessionReducer from "./session/reducer";
import sprintsReducer from "./sprints/reducer";
import tasksReducer from "./tasks/reducer";
import usersReducer from "./users/reducer";

const reducer = combineReducers({
  users: usersReducer,
  session: sessionReducer,
  operations: operationsReducer,
  keyValue: keyValueReducer,
  rooms: roomsReducer,
  sprints: sprintsReducer,
  comments: commentsReducer,
  organizations: organizationsReducer,
  boards: boardsReducer,
  tasks: tasksReducer,
  collaborationRequests: collaborationRequestsReducer,
});

const store = configureStore({
  reducer,
});

export default store;
