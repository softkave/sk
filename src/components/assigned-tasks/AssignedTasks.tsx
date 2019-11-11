import { Result } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import OperationError from "../../utils/operation-error/OperationError";
import { IBlockMethods } from "../block/methods";
import FormError from "../form/FormError";
import Loading from "../Loading";
import StyledCenterContainer from "../styled/CenterContainer";
import AssignedTasksKanbanBoard from "./KanbanBoard";

export interface IAssignedTasksProps {
  isDataLoading: boolean;
  isDataLoaded: boolean;
  user: IUser;
  blockHandlers: IBlockMethods;
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
    const {
      isDataLoading,
      error,
      tasks,
      parents,
      user,
      blockHandlers,
      isDataLoaded
    } = this.props;

    if (error) {
      return (
        <StyledCenterContainer>
          <Result status="error" title="Error">
            <FormError error={error} />
          </Result>
        </StyledCenterContainer>
      );
    } else if (isDataLoading || !isDataLoaded) {
      return <Loading />;
    }

    return (
      <AssignedTasksKanbanBoard
        blockHandlers={blockHandlers}
        parents={parents!}
        tasks={tasks!}
        user={user}
      />
    );
  }
}

export default AssignedTasks;
