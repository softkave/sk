import React from "react";
import { connect } from "react-redux";

import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import { getSignedInUser } from "../../../redux/session/selectors";
import { getReduxConnectors } from "../../../utils/redux";
import { getBlockMethods, IBlockMethods } from "../methods";
import Group from "./Group";

export interface IGroupProps {
  group: IBlock;
  blockHandlers: IBlockMethods;
  draggableId: string;
  index: number;
  context: "task" | "project";
  selectedCollaborators: { [key: string]: boolean };
  user: IUser;
  toggleForm: (type: string, block: IBlock) => void;
  onClickAddChild: (type: string, group: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onViewMore: () => void;
  disabled?: boolean;
}

function mergeProps({ state }, { dispatch }) {
  return {
    blockHandlers: getBlockMethods({ state, dispatch }),
    user: getSignedInUser(state)
  };
}

export default getReduxConnectors(mergeProps)(Group);
