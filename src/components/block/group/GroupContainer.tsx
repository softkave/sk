import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IBlock } from "../../../models/block/block";
import { getBlock } from "../../../redux/blocks/selectors";
import { getSignedInUser } from "../../../redux/session/selectors";
import { IReduxState } from "../../../redux/store";
import { getBlockMethods } from "../methods";
import BlockInternalDataLoader, {
  IBlockInternalDataLoaderProps
} from "./BlockInternalDataLoader";
import Group from "./Group";

export interface IGroupContainerProps {
  groupID?: string;
  group?: IBlock;
  draggableID: string;
  index: number;
  context: "task" | "project";
  selectedCollaborators: { [key: string]: boolean };
  toggleForm: (type: string, block: IBlock) => void;
  onClickAddChild: (type: string, group: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onViewMore: () => void;
  disabled?: boolean;
  withViewMore?: boolean;
}

function mapStateToProps(state: IReduxState) {
  console.log("GC state");
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  console.log("GC dispatch");
  return { dispatch };
}

function mergeProps(
  state,
  { dispatch },
  ownProps: IGroupContainerProps
): IBlockInternalDataLoaderProps {
  console.log("GC merge");
  if (!ownProps.group && !ownProps.groupID) {
    throw new Error("group or groupID required");
  }

  const group = ownProps.group || getBlock(state, ownProps.groupID!);
  const blockHandlers = getBlockMethods({ state, dispatch });
  const user = getSignedInUser(state);
  console.log("I got to group container");

  return {
    block: group,
    blockType: "group",
    render: ({ blockChildren }) => {
      console.log("i got here");
      return (
        <Group
          withViewMore={ownProps.withViewMore}
          group={group}
          blockHandlers={blockHandlers}
          draggableID={ownProps.draggableID}
          index={ownProps.index}
          context={ownProps.context}
          selectedCollaborators={ownProps.selectedCollaborators}
          user={user!}
          tasks={blockChildren.tasks!}
          projects={blockChildren.projects!}
          toggleForm={ownProps.toggleForm}
          onClickAddChild={ownProps.onClickAddChild}
          setCurrentProject={ownProps.setCurrentProject}
          onViewMore={ownProps.onViewMore}
          disabled={ownProps.disabled}
        />
      );
    }
  };
}

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
//   mergeProps
// )(BlockInternalDataLoader);

export default function SideGroup(props: any) {
  return (
    <BlockInternalDataLoader
      block={props.group}
      blockType="group"
      render={({ blockChildren, blockHandlers, user }) => {
        console.log("i got here");
        // return "LoL";
        const ownProps = props;
        const group = props.group;
        return (
          <Group
            withViewMore={ownProps.withViewMore}
            group={group}
            blockHandlers={blockHandlers}
            draggableID={ownProps.draggableID}
            index={ownProps.index}
            context={ownProps.context}
            selectedCollaborators={ownProps.selectedCollaborators}
            user={user!}
            tasks={blockChildren.tasks!}
            projects={blockChildren.projects!}
            toggleForm={ownProps.toggleForm}
            onClickAddChild={ownProps.onClickAddChild}
            setCurrentProject={ownProps.setCurrentProject}
            onViewMore={ownProps.onViewMore}
            disabled={ownProps.disabled}
          />
        );
      }}
    />
  );
}
