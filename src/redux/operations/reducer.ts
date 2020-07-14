import { createReducer } from "@reduxjs/toolkit";
import SessionActions from "../session/actions";
import OperationActions from "./actions";
import { IOperation } from "./operation";

export interface IOperationState {
  [key: string]: IOperation;
}

const operationsReducer = createReducer({}, (builder) => {
  builder.addCase(OperationActions.pushOperation, (state, action) => {
    state[action.payload.id] = action.payload;
  });

  builder.addCase(OperationActions.deleteOperation, (state, action) => {
    delete state[action.payload];
  });

  builder.addCase(SessionActions.logoutUser, (state) => {
    return {};
  });
});

export default operationsReducer;
