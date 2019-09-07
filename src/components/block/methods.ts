import { Dispatch } from "redux";

import { makePipeline } from "../FormPipeline";
import addBlockPipeline, {
  AddBlockPipelineEntryFunc
} from "./methods/addBlock";
import addCollaboratorPipeline, {
  AddCollaboratorPipelineEntryFunc
} from "./methods/addCollaborators";
import deleteBlockPipeline, {
  DeleteBlockPipelineEntryFunc
} from "./methods/deleteBlock";
import fetchRootDataPipeline, {
  FetchRootDataPipelineEntryFunc
} from "./methods/fetchRootData";
import getBlockPipeline, {
  GetBlockPipelineEntryFunc
} from "./methods/getBlock";
import getBlockChildrenPipeline, {
  GetBlockChildrenPipelineEntryFunc
} from "./methods/getBlockChildren";
import getCollaborationRequestsPipeline, {
  GetCollaborationRequestsPipelineEntryFunc
} from "./methods/getCollaborationRequests";
import getCollaboratorsPipeline, {
  GetCollaboratorsPipelineEntryFunc
} from "./methods/getCollaborators";
import toggleTaskPipeline, {
  ToggleTaskPipelineEntryFunc
} from "./methods/toggleTask";
// import transferBlockPipeline, {
//   TransferBlockPipelineEntryFunc
// } from "./methods/transferBlock";
import updateBlockPipeline, {
  UpdateBlockPipelineEntryFunc
} from "./methods/updateBlock";

// TODO: Define the return types of the pipeline methods
// TODO: Add the type of the handleError function amdn maybe validate in the runtime
// TODO: Consider validating the pipeline methods arguments in runtime
// TODO: Add ResultType to the pipelines

export interface IBlockMethods {
  onAdd: AddBlockPipelineEntryFunc;
  onUpdate: UpdateBlockPipelineEntryFunc;
  onToggle: ToggleTaskPipelineEntryFunc;
  onDelete: DeleteBlockPipelineEntryFunc;
  onAddCollaborators: AddCollaboratorPipelineEntryFunc;
  getBlock: GetBlockPipelineEntryFunc;
  getBlockChildren: GetBlockChildrenPipelineEntryFunc;
  getCollaborators: GetCollaboratorsPipelineEntryFunc;
  getCollaborationRequests: GetCollaborationRequestsPipelineEntryFunc;
  fetchRootData: FetchRootDataPipelineEntryFunc;
  // onTransferBlock: TransferBlockPipelineEntryFunc;
}

export interface IGetBlockMethodsParams {
  dispatch: Dispatch;

  // TODO: Define state's type
  state: any;
}

export function getBlockMethods(
  reduxParams: IGetBlockMethodsParams
): IBlockMethods {
  return {
    onAdd: makePipeline(addBlockPipeline, reduxParams),
    onUpdate: makePipeline(updateBlockPipeline, reduxParams),
    onToggle: makePipeline(toggleTaskPipeline, reduxParams),
    onDelete: makePipeline(deleteBlockPipeline, reduxParams),
    onAddCollaborators: makePipeline(addCollaboratorPipeline, reduxParams),
    getBlockChildren: makePipeline(getBlockChildrenPipeline, reduxParams),
    getCollaborators: makePipeline(getCollaboratorsPipeline, reduxParams),
    getCollaborationRequests: makePipeline(
      getCollaborationRequestsPipeline,
      reduxParams
    ),
    fetchRootData: makePipeline(fetchRootDataPipeline, reduxParams),
    // onTransferBlock: makePipeline(transferBlockPipeline, reduxParams),
    getBlock: makePipeline(getBlockPipeline, reduxParams)
  };
}
