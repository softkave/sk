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

  redux({ state, dispatch, result }) {
    const { blocks } = result;
    let rootBlock: any = null;
    const orgs = {};
    blocks.forEach(blk => {
      if (blk.type === "root") {
        rootBlock = blk;
      } else if (blk.type === "org") {
        orgs[blk.customId] = blk;
      }
    });

    dispatch(bulkAddBlocksRedux());
  }
};

export default fetchRootDataPipeline;

export type FetchRootDataPipelineEntryFunc = PipelineEntryFunc<undefined>;
