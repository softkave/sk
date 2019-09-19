import { connect } from "react-redux";
import { Dispatch } from "redux";

import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { setCurrentOrg } from "../../redux/view/actions";
import { getCurrentOrgID } from "../../redux/view/selectors";
import SelectOrg from "./SelectOrg";

function mapStateToProps(state: IReduxState) {
  const user = getSignedInUserRequired(state);

  return {
    currentOrgID: getCurrentOrgID(state),
    orgs: getBlocksAsArray(state, user.orgs)
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onChange(orgID: string) {
      dispatch(setCurrentOrg(orgID));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectOrg);
