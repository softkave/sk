import { makeMerge, makeDelete } from "./make";

export function addBlock(parent, block) {
  if (parent) {
    block.path = `${parent.path}.${block.type}s.${block.id}`;
  } else {
    block.path = `${block.type}s.${block.id}`;
  }

  return makeMerge(block.path, block);
}

export function updateBlock(block, data) {
  return makeMerge(block.path, block);
}

export function deleteBlock(block) {
  return makeDelete(block.path);
}
