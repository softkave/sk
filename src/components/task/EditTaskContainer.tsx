import { connect } from "react-redux";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import EditTask from "./EditTask";

export interface IEditTaskContainerProps {
  customId: string;
  operationID: string;
}

function mapStateToProps(state: IReduxState, props: IEditTaskContainerProps) {
  return {
    operation: getOperationWithIDForResource(
      state,
      props.operationID,
      props.customId
    )
  };
}

export default connect(mapStateToProps)(EditTask);
