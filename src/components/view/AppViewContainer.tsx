import { connect } from "react-redux";
import { IReduxState } from "../../redux/store";
import { getCurrentView } from "../../redux/view/selectors";
import AppView from "./AppView";

function mapStateToProps(state: IReduxState) {
  return {
    currentView: getCurrentView(state)!
  };
}

export default connect(mapStateToProps)(AppView);
