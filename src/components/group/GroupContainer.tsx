import React from "react";
import { connect } from "react-redux";

import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import { IReduxState } from "../../redux/store";
import BlockInternalDataLoader from "./BlockDataLoaderContainer";
import Group from "./Group";
import GroupViewManager from "./GroupViewManager";

function mapStateToProps(state: IReduxState) {
  const operation =  
}

function mapDispatchToProps(dispatch: Dispatch) {

}

export default connect(mapStateToProps, mapDispatchToProps)(GroupViewManager);

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

// TODO: Loading groups show loading which doesn't look good. Consider using an empty group instead
// export default function SideGroup(props: any) {
//   return (
//     <BlockInternalDataLoader
//       block={props.group}
//       blockType="group"
//       render={({ blockChildren, blockHandlers, user }) => {
//         const ownProps = props;
//         const group = props.group;
//         return (
//           <Group
//             withViewMore={ownProps.withViewMore}
//             group={group}
//             blockHandlers={blockHandlers}
//             draggableID={ownProps.draggableID}
//             index={ownProps.index}
//             context={ownProps.context}
//             selectedCollaborators={ownProps.selectedCollaborators}
//             user={user!}
//             tasks={blockChildren.tasks!}
//             projects={blockChildren.projects!}
//             toggleForm={ownProps.toggleForm}
//             onClickAddChild={ownProps.onClickAddChild}
//             setCurrentProject={ownProps.setCurrentProject}
//             onViewMore={ownProps.onViewMore}
//             disabled={ownProps.disabled}
//           />
//         );
//       }}
//     />
//   );
// }
