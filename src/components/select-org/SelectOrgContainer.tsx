import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { clearViewsFrom, setCurrentOrg } from "../../redux/view/actions";
import { currentOrgViewName, ICurrentOrgView } from "../../redux/view/orgs";
import { getView } from "../../redux/view/selectors";
import SelectOrg from "./SelectOrg";

function mapStateToProps(state: IReduxState) {
  const user = getSignedInUserRequired(state);
  const currentOrgView = getView<ICurrentOrgView>(state, currentOrgViewName);

  return {
    currentOrgID: currentOrgView ? currentOrgView.orgID : undefined,
    orgs: getBlocksAsArray(state, user.orgs)
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onSelectOrg(org: IBlock) {
      dispatch(setCurrentOrg(org));
    },
    gotoOrgs() {
      dispatch(clearViewsFrom(currentOrgViewName));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectOrg);
