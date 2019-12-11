import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import { getBlockChildrenOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import B, { IBBasket } from "../board/B";
import ColumnWithTitleAndCount from "../board/ColumnWithTitleAndCount";
import GeneralError from "../GeneralError";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import Loading from "../Loading";
import TaskList from "./TaskList";

export interface ITProps {
  parent: IBlock;
}

const T: React.FC<ITProps> = props => {
  const { parent } = props;
  const taskIDs = parent.tasks;
  const tasks = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, taskIDs)
  );

  const loadParentChildren = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockChildrenOperationFunc({ block: parent });
    }
  };

  const renderBasket = (basket: IBBasket) => {
    return (
      <ColumnWithTitleAndCount
        title={parent.name}
        count={tasks.length}
        body={<TaskList tasks={tasks} />}
      />
    );
  };

  const loadParentChildrenStatus = useOperation(
    { operationID: getBlockChildrenOperationID, resourceID: parent.customId },
    loadParentChildren
  );

  if (
    loadParentChildrenStatus.isLoading ||
    !!!loadParentChildrenStatus.operation
  ) {
    return <Loading />;
  } else if (loadParentChildrenStatus.error) {
    return <GeneralError error={loadParentChildrenStatus.error} />;
  }

  return (
    <B
      blocks={tasks}
      getBaskets={() => [{ key: "tasks", blocks: tasks }]}
      renderBasket={renderBasket}
    />
  );
};

export default T;
