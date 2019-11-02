import { connect } from "react-redux";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import ProjectFormWithFormik from "./ProjectFormWithFormik";

export interface IProjectFormContainerProps {
  customId: string;
  operationID: string;
}

function mapStateToProps(
  state: IReduxState,
  props: IProjectFormContainerProps
) {
  return {
    operation: getOperationWithIDForResource(
      state,
      props.operationID,
      props.customId
    ),

    getFormIdentifier() {
      return "ProjectForm";
    }
  };
}

export default connect(mapStateToProps)(ProjectFormWithFormik);
