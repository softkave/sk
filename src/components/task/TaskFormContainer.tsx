import { connect } from "react-redux";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import TaskFormWithFormik from "./TaskFormWithFormik";

export interface ITaskFormContainerProps {
  customId: string;
  operationID: string;
}

function mapStateToProps(state: IReduxState, props: ITaskFormContainerProps) {
  return {
    operation: getOperationWithIDForResource(
      state,
      props.operationID,
      props.customId
    ),

    getFormIdentifier() {
      return "TaskForm";
    }
  };
}

export default connect(mapStateToProps)(TaskFormWithFormik);
