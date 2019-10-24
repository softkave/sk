import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  defaultOperationStatusTypes,
  getOperationLastStatus,
  isOperationStarted
} from "../redux/operations/operation";
import { initializeAppSessionOperationID } from "../redux/operations/operationIDs";
import { getOperationsWithID } from "../redux/operations/selectors";
import initializeAppSessionOperation from "../redux/operations/session/initializeAppSession";
import { getSessionType, isUserSignedIn } from "../redux/session/selectors";
import { IReduxState } from "../redux/store";
import IndexViewManager from "./IndexViewManager";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }: { dispatch: Dispatch }) {
  const sessionType = getSessionType(state);
  const initializeOperation = getOperationsWithID(
    state,
    initializeAppSessionOperationID
  )[0];

  console.log({ sessionType, initializeOperation });
  // return {
  //   view: { viewName: sessionInitializing },
  //   initializingProps: { progress: 50 }
  // };

  if (sessionType === "initializing") {
    if (!initializeOperation) {
      initializeAppSessionOperation(state, dispatch);

      return {
        view: { viewName: sessionType },
        initializingProps: {
          progress: 0
        }
      };
    } else if (isOperationStarted(initializeOperation)) {
      return {
        view: { viewName: sessionType },
        initializingProps: {
          progress: 50
        }
      };
    } else {
      throw new Error("Application error");
    }
  } else if (sessionType === "web" || sessionType === "app") {
    if (initializeOperation && isUserSignedIn(state)) {
      const latestStatus = getOperationLastStatus(initializeOperation);
      // dispatch(
      //   consumeOperation(
      //     initializeOperation.operationID,
      //     initializeOperation.resourceID
      //   )
      // );

      // TODO: loading is not going to be completed, i don't like that, add the complete part
      return {
        view: { viewName: sessionType },
        initializingProps: {
          progress: 100
        },
        readyProps: {
          error:
            latestStatus &&
            latestStatus.status === defaultOperationStatusTypes.operationError
              ? latestStatus.data
              : undefined
        }
      };
    } else {
      return { view: { viewName: sessionType } };
    }
  }

  throw new Error("Application error");
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(IndexViewManager);
