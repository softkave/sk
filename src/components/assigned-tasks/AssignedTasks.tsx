import styled from "@emotion/styled";
import { Alert } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import OperationError from "../../utils/operation-error/OperationError";
import FormError from "../form/FormError";
import Loading from "../Loading";

export interface IAssignedTasksProps {
  isDataLoading: boolean;
  isDataLoaded: boolean;
  fetchAssignedTasksAndParents: () => void;
  tasks?: IBlock[];
  parents?: IBlock[];
  error?: OperationError;
}

class AssignedTasks extends React.Component<IAssignedTasksProps> {
  public componentDidMount() {
    const {
      isDataLoaded,
      isDataLoading,
      fetchAssignedTasksAndParents
    } = this.props;

    if (!isDataLoaded && !isDataLoading) {
      fetchAssignedTasksAndParents();
    }
  }

  public render() {
    const { isDataLoading, error } = this.props;

    if (isDataLoading) {
      return <Loading />;
    } else if (error) {
      return (
        <Alert
          showIcon
          type="error"
          message="An Error Occurred"
          description={<FormError error={error} />}
        />
      );
    }

    return null;
  }
}

export default AssignedTasks;
