import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { setCurrentOrg, setRootView } from "../../redux/view/actions";
import {
  currentOrgViewName,
  ICurrentOrgView,
  makeOrgsView
} from "../../redux/view/orgs";
import { getView } from "../../redux/view/selectors";
import SelectOrg from "./SelectOrg";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatch
  };
}

function mergeProps(state: IReduxState, { dispatch }: { dispatch: Dispatch }) {
  const user = getSignedInUserRequired(state);
  const currentOrgView = getView<ICurrentOrgView>(state, currentOrgViewName);

  return {
    currentOrgID: currentOrgView ? currentOrgView.orgID : undefined,
    orgs: getBlocksAsArray(state, user.orgs),
    onSelectOrg(org: IBlock) {
      dispatch(setRootView(makeOrgsView()));
      dispatch(setCurrentOrg(org));
    },
    gotoOrgs() {
      dispatch(setRootView(makeOrgsView()));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(SelectOrg);
