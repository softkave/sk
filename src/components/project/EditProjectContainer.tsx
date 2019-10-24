import { connect } from "react-redux";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import EditProject from "./EditProject";

export interface IEditProjectContainerProps {
  customId: string;
  operationID: string;
}

function mapStateToProps(
  state: IReduxState,
  props: IEditProjectContainerProps
) {
  return {
    operation: getOperationWithIDForResource(
      state,
      props.operationID,
      props.customId
    )
  };
}

export default connect(mapStateToProps)(EditProject);
