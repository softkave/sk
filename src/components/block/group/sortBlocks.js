export function sortBlocksByPosition(blocks = {}, sortIds = []) {
  const sortedBlocks = [];
  sortIds.forEach(id => {
    if (blocks[id]) {
      sortedBlocks.push(blocks[id]);
    }
  });

  return sortedBlocks;
}
