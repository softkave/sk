// import { connect } from "react-redux";
// import { Dispatch } from "redux";
// import {
//   defaultOperationStatusTypes,
//   getOperationLastStatus,
//   isOperationStarted
// } from "../redux/operations/operation";
// import { initializeAppSessionOperationID } from "../redux/operations/operationIDs";
// import { getOperationsWithID } from "../redux/operations/selectors";
// import initializeAppSessionOperationFunc from "../redux/operations/session/initializeAppSession";
// import { getSessionType, isUserSignedIn } from "../redux/session/selectors";
// import { IReduxState } from "../redux/store";
// import IndexViewManager from "./IndexViewManager";

// function mapStateToProps(state: IReduxState) {
//   return state;
// }

// function mapDispatchToProps(dispatch: Dispatch) {
//   return { dispatch };
// }

// function mergeProps(state, { dispatch }: { dispatch: Dispatch }) {
//   const sessionType = getSessionType(state);
//   const initializeOperation = getOperationsWithID(
//     state,
//     initializeAppSessionOperationID
//   )[0];

//   if (sessionType === "initializing") {
//     if (!initializeOperation) {
//       initializeAppSessionOperationFunc();

//       return {
//         view: { viewName: sessionType },
//         initializingProps: {
//           progress: 0
//         }
//       };
//     } else if (isOperationStarted(initializeOperation)) {
//       return {
//         view: { viewName: sessionType },
//         initializingProps: {
//           progress: 50
//         }
//       };
//     } else {
//       throw new Error("Application error");
//     }
//   } else if (sessionType === "web" || sessionType === "app") {
//     if (initializeOperation && isUserSignedIn(state)) {
//       const latestStatus = getOperationLastStatus(initializeOperation);

//       // TODO: loading is not going to be completed, I don't like that, add the complete part
//       // TODO: Debug SoftkaveLoading
//       return {
//         view: { viewName: sessionType },
//         initializingProps: {
//           progress: 100
//         },
//         readyProps: {
//           error:
//             latestStatus &&
//             latestStatus.status === defaultOperationStatusTypes.operationError
//               ? latestStatus.data
//               : undefined
//         }
//       };
//     } else {
//       return { view: { viewName: sessionType } };
//     }
//   }

//   throw new Error("Application error");
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
//   mergeProps
// )(IndexViewManager);

export const a = "a";
