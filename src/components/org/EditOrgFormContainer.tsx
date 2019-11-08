import { connect } from "react-redux";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import EditOrgFormWithFormik from "./EditOrgFormWithFormik";

export interface IEditOrgContainerProps {
  customId: string;
  operationID: string;
}

function mapStateToProps(state: IReduxState, props: IEditOrgContainerProps) {
  return {
    operation: getOperationWithIDForResource(
      state,
      props.operationID,
      props.customId
    ),

    getFormIdentifier() {
      return "OrgForm";
    }
  };
}

export default connect(mapStateToProps)(EditOrgFormWithFormik);
