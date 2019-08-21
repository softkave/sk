import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IBlock } from "../../../models/block/block";
import { getBlock } from "../../../redux/blocks/selectors";
import { IReduxState } from "../../../redux/store";
import { getBlockMethods } from "../methods";
import DataLoader, { IDataLoaderProps } from "./DataLoader";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return dispatch;
}

export interface IBlockLoaderProps {
  blockID: string;
  render: (renderParams: { block: IBlock }) => React.ReactNode;
}

function mergeProps(
  state: IReduxState,
  dispatch: Dispatch,
  ownProps: IBlockLoaderProps
): IDataLoaderProps {
  const block = getBlock(state, ownProps.blockID);
  const blockHandlers = getBlockMethods({ state, dispatch });

  return {
    data: ownProps.blockID,
    isDataLoaded: () => !!block,
    areDataSame: (data1: string, data2: string) => data1 === data2,
    loadData: async () => blockHandlers.getBlock({ blockID: ownProps.blockID }),
    render: () => ownProps.render({ block })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DataLoader);
