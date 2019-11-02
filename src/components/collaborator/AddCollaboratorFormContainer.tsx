import { connect } from "react-redux";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import AddCollaboratorFormWithFormik from "./AddCollaboratorFormWithFormik";

export interface IAddCollaboratorFormContainerProps {
  customId: string;
  operationID: string;
}

function mapStateToProps(
  state: IReduxState,
  props: IAddCollaboratorFormContainerProps
) {
  return {
    operation: getOperationWithIDForResource(
      state,
      props.operationID,
      props.customId
    ),

    getFormIdentifier() {
      return "AddCollaboratorForm";
    }
  };
}

export default connect(mapStateToProps)(AddCollaboratorFormWithFormik);
