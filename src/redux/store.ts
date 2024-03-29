import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "./boards/reducer";
import collaborationRequestsReducer from "./collaborationRequests/reducer";
import commentsReducer from "./comments/reducer";
import keyValueReducer from "./key-value/reducer";
import mapsReducer from "./maps/reducer";
import organizationsReducer from "./organizations/reducer";
import roomsReducer from "./rooms/reducer";
import sessionReducer from "./session/reducer";
import sprintsReducer from "./sprints/reducer";
import tasksReducer from "./tasks/reducer";
import usersReducer from "./users/reducer";

const reducer = {
  users: usersReducer,
  session: sessionReducer,
  keyValue: keyValueReducer,
  rooms: roomsReducer,
  sprints: sprintsReducer,
  comments: commentsReducer,
  organizations: organizationsReducer,
  boards: boardsReducer,
  tasks: tasksReducer,
  collaborationRequests: collaborationRequestsReducer,
  maps: mapsReducer,
};

const store = configureStore({
  reducer,
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export default store;
