import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { bulkAddBlocksRedux } from "../../../redux/blocks/actions";
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
  async net() {
    return await netInterface("block.getRoleBlocks");
  },

  redux({ dispatch, result }) {
    const { blocks } = result;
    dispatch(bulkAddBlocksRedux(blocks));
  }
};

export default fetchRootDataPipeline;

export type FetchRootDataPipelineEntryFunc = PipelineEntryFunc<undefined>;
