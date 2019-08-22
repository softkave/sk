import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { bulkAddBlocksRedux } from "../../../redux/blocks/actions";
import { getSignedInUser } from "../../../redux/session/selectors";
import { updateUserRedux } from "../../../redux/users/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

interface IFetchRootDataNetResult {
  blocks: IBlock[];
}

const fetchRootDataPipeline: IPipeline<
  null,
  null,
  IFetchRootDataNetResult,
  IFetchRootDataNetResult
> = {
  async net({ state, dispatch }) {
    const user = getSignedInUser(state);
    dispatch(updateUserRedux(user!.customId, { loadingRootData: true }));
    return await netInterface("block.getRoleBlocks");
  },

  redux({ dispatch, result, state }) {
    const { blocks } = result;
    const user = getSignedInUser(state);
    dispatch(bulkAddBlocksRedux(blocks));
    dispatch(updateUserRedux(user!.customId, { loadingRootData: false }));
  }
};

export default fetchRootDataPipeline;

export type FetchRootDataPipelineEntryFunc = PipelineEntryFunc<undefined>;
