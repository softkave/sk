import { createReducer } from "@reduxjs/toolkit";
import { isUndefined } from "lodash";
import SessionActions from "../session/actions";
import OperationActions from "./actions";
import { IOperation } from "./operation";

export interface IOperationState {
    [key: string]: IOperation;
}

const operationsReducer = createReducer({}, (builder) => {
    builder.addCase(OperationActions.pushOperation, (state, action) => {
        const existingOp = state[action.payload.id];
        // let op = action.payload
        state[action.payload.id] = action.payload;

        if (isUndefined(action.payload.meta) && existingOp && existingOp.meta) {
            // op = {...op, meta: existingOp.meta}
            state[action.payload.id].meta = existingOp.meta;
        }
    });

    builder.addCase(OperationActions.deleteOperation, (state, action) => {
        delete state[action.payload];
    });

    builder.addCase(OperationActions.bulkAddOperations, (state, action) => {
        action.payload.forEach((op) => (state[op.id] = op));
    });

    builder.addCase(SessionActions.logoutUser, (state) => {
        return {};
    });
});

export default operationsReducer;
