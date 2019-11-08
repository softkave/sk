import { connect } from "react-redux";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import GroupFormWithFormik from "./GroupFormWithFormik";

export interface IGroupFormContainerProps {
  customId: string;
  operationID: string;
}

function mapStateToProps(state: IReduxState, props: IGroupFormContainerProps) {
  return {
    operation: getOperationWithIDForResource(
      state,
      props.operationID,
      props.customId
    ),

    getFormIdentifier() {
      return "GroupForm";
    }
  };
}

export default connect(mapStateToProps)(GroupFormWithFormik);
