import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { consumeOperation } from "../../redux/operations/actions";
import loadRootBlocksOperation from "../../redux/operations/block/loadRootBlock";
import { isOperationCompleted } from "../../redux/operations/operation";
import { loadRootBlocksOperationID } from "../../redux/operations/operationIDs";
import { getOperationsWithID } from "../../redux/operations/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import Orgs from "./Orgs";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

function mergeProps(state: IReduxState, { dispatch }: { dispatch: Dispatch }) {
  const loadInitialBlocksOperation = getOperationsWithID(
    state,
    loadRootBlocksOperationID
  )[0];
  const user = getSignedInUserRequired(state);
  const orgs = getBlocksAsArray(state, user.orgs);

  if (loadInitialBlocksOperation || user.orgs.length === orgs.length) {
    if (
      loadInitialBlocksOperation &&
      isOperationCompleted(loadInitialBlocksOperation)
    ) {
      dispatch(
        consumeOperation(
          loadInitialBlocksOperation.operationID,
          loadInitialBlocksOperation.resourceID
        )
      );
    }
  } else {
    loadRootBlocksOperation(state, dispatch);
  }

  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Orgs);
