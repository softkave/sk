import values from "lodash/values";

// export function sortBlocksByPosition(blocks = {}, sortIds = []) {
//   const sortedBlocks = sortIds.map(id => blocks[id]);
//   return sortedBlocks;
// }

export function sortBlocksByPosition(blocks = {}) {
  let blocksArray = null;

  if (Array.isArray(blocks)) {
    blocksArray = blocks;
  } else {
    blocksArray = values(blocks);
  }

  blocksArray.sort((a, b) => {
    const positionDiff = a.position - b.position;

    if (positionDiff === 0) {
      // return (a.timestamp - b.timestamp) * -1;
      return a.timestamp - b.timestamp;
    }

    return positionDiff * -1;
  });

  if (blocksArray.length === 2) {
    blocksArray.reverse();
  }

  return blocksArray;

  // const blocksWithPosition = [];
  // const sortedBlocks = [];

  // for (const block of blocksArray) {
  //   if (block.position && block.position >= 0) {
  //     blocksWithPosition.push(block);
  //   } else {
  //     sortedBlocks.push(block);
  //   }
  // }

  // blocksWithPosition.forEach(task => {
  //   sortedBlocks.splice(task.position, 0, task);
  // });

  const blocksWithPosition = {};
  // const sortedBlocks = [...blocksArray];
  const sortedBlocks = [];
  // let positionInfo = [];
  // blocksArray.forEach(block => {
  // sortedBlocks.push(block);
  // if (block.position >= 0) {
  // const [position, timestamp] = block.position.split("-");
  // const { position, positionTimestamp: timestamp } = block;
  // let info = { timestamp, position, block };
  // positionInfo.push({ timestamp, position, block });

  // if (!Array.isArray(blocksWithPosition[position])) {
  //   blocksWithPosition[position] = [];

  // }

  // console.log(info);
  // blocksWithPosition[position].push(info);

  // if (Array.isArray(blocksWithPosition[position])) {
  //   blocksWithPosition[position] = blocksWithPosition[position].push({
  //     timestamp,
  //     position,
  //     block
  //   });
  // } else {
  //   blocksWithPosition[position] = [{ timestamp, position, block }];
  // }
  //   } else {
  //     sortedBlocks.push(block);
  //   }
  // });

  // sortedBlocks.sort((a, b) => {

  // });

  // console.log({ blocksWithPosition, blocksArray });
  // const sortedBlocksWithPosition = [];

  // for (const position in blocksWithPosition) {
  //   const blocks = blocksWithPosition[position];
  //   blocks.sort((a, b) => {
  //     return a.timestamp - b.timestamp;
  //   });

  //   blocks.reverse();
  //   sortedBlocksWithPosition.push(blocks);
  //   sortedBlocks

  // if (position >= sortedBlocksWithPosition) {
  //   sortedBlocksWithPosition.push(blocks);
  // } else {
  //   sortBlocksByPosition
  // }
  // }

  // console.log({ sortedBlocks, blocksWithPosition });

  // sortedBlocksWithPosition.sort((a, b) => {
  //   return a.position - b.position;
  // });

  // sortedBlocksWithPosition.reverse();
  // sortedBlocksWithPosition.forEach(blocks => {
  //   blocks = blocks.map(({block, position}) => block);
  //   sortedBlocks.splice(position, 0, ...blocks);

  //   if (position >= sortedBlocks.length) {
  //     sortedBlocks = sortedBlocks.concat(blocks);
  //   } else {

  //   }
  // });

  // for (const position in blocksWithPosition) {
  //   const blocks = blocksWithPosition[position].map(({ block }) => block);
  //   sortedBlocks.splice(position, 0, ...blocks);
  // }

  // positionInfo.sort((a, b) => {
  //   const positionDiff = a.position - b.position;

  //   if (positionDiff === 0) {
  //     // return (a.timestamp - b.timestamp) * -1;
  //     return (a.timestamp - b.timestamp);
  //   }

  //   return positionDiff * -1;
  // });

  // const positionInfo = blocksWithPosition.reduce((info, next) => {
  //   return info.concat(next)
  // }, []);

  // positionInfo.reverse();
  // positionInfo.forEach(({ position, block }) => {
  //   sortedBlocks.splice(position, 0, )
  // })

  return sortedBlocks;
}
