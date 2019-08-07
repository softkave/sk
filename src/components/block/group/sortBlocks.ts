import { IBlock } from "../../../models/block/block";

// TODO: Define types
export function sortBlocksByPosition(
  blocks: { [key: string]: IBlock } = {},
  sortIds: string[] = []
) {
  const sortedBlocks: IBlock[] = [];
  sortIds.forEach(id => {
    if (blocks[id]) {
      sortedBlocks.push(blocks[id]);
    }
  });

  return sortedBlocks;
}

const blockPriorityToNumMap = {
  "very important": 3,
  important: 2,
  "not important": 1
};

export function sortBlocksByPriority(blocks: IBlock[] = []) {
  return blocks.sort((blockA, blockB) => {
    const blockAPriorityNum = blockPriorityToNumMap[blockA.priority];
    const blockBPriorityNum = blockPriorityToNumMap[blockB.priority];

    return blockAPriorityNum - blockBPriorityNum;
  });
}

export function sortBlocksByExpirationDate(blocks: IBlock[]) {}
