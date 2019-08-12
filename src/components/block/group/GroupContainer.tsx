import React from "react";

import { IBlock } from "../../../models/block/block";
import { getBlock, getBlocksAsArray } from "../../../redux/blocks/selectors";
import { getSignedInUser } from "../../../redux/session/selectors";
import { getReduxConnectors } from "../../../utils/redux";
import { getBlockMethods } from "../methods";
import DataLoader from "./DataLoader";
import Group, { IGroupProps } from "./Group";
import { IReduxState } from "../../../redux/store";
import { Dispatch } from "redux";
import { connect } from "react-redux";

interface IInternalGroupContainerProps extends IGroupProps {}

class InternalGroupContainer extends React.Component<
  IInternalGroupContainerProps
> {
  public isDataLoaded() {
    const { context, projects, tasks } = this.props;

    if (context === "project") {
      return Array.isArray(projects);
    } else if (context === "task") {
      return Array.isArray(tasks);
    }

    return false;
  }

  public renderGroup() {
    return <Group {...this.props} />;
  }

  public render() {
    const { group, blockHandlers } = this.props;

    return (
      <DataLoader
        isDataLoaded={this.isDataLoaded}
        areDataSame={(group1: IBlock, group2: IBlock) =>
          group1.customId === group2.customId
        }
        loadData={() =>
          blockHandlers.getBlockChildren({
            block: group,
            updateBlock: blockHandlers.onUpdate
          })
        }
        render={this.renderGroup}
        data={group}
      />
    );
  }
}

export interface IGroupContainerProps {
  groupID: string;
  draggableID: string;
  index: number;
  context: "task" | "project";
  selectedCollaborators: { [key: string]: boolean };
  toggleForm: (type: string, block: IBlock) => void;
  onClickAddChild: (type: string, group: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onViewMore: () => void;
  disabled?: boolean;
}

function mapStateToProps(state: IReduxState, ownProps: IGroupContainerProps) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: IGroupContainerProps) {
  return dispatch;
}

function mergeProps(state, dispatch, ownProps: IGroupContainerProps) {
  const group = getBlock(state, ownProps.groupID);

  return {
    ...ownProps,
    group,
    user: getSignedInUser(state),
    blockHandlers: getBlockMethods({ state, dispatch }),
    tasks: getBlocksAsArray(state, group.tasks),
    projects: getBlocksAsArray(state, group.projects)
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(InternalGroupContainer);
