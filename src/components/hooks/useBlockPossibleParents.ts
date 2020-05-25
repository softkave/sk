import { useStore } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import useBlockParents from "./useBlockParent";

const useBlockPossibleParents = (block: IBlock) => {
  const store = useStore();
  const parents = useBlockParents(block);
  let pp: IBlock[] = [];

  parents.reverse().forEach((p) => {
    const groups = getBlocksAsArray(store.getState(), p.groups || []);
    const projects = getBlocksAsArray(store.getState(), p.projects || []);
    pp = pp.concat(p, groups, projects);
  });

  pp = pp.filter((p) => p.type !== block.type);

  return pp;

  // immediate parent
  // const parent0 = hasParents ? parents[parents.length - 1] : null;

  // if (block.type !== "org") {
  //   if (parent0) {
  //     const parent0Groups =
  //       parent0 && block.type !== "group"
  //         ? getBlocksAsArray(store.getState(), parent0!.groups || [])
  //         : [];

  //     // immediate parent's parent
  //     const parent1 =
  //       parent0 && parent0.type === "group"
  //         ? parents[parents.length - 2]
  //         : null;
  //     const hasParent1 = !!parent1;

  //     if (hasParent1) {
  //       const parent1Groups =
  //         hasParent1 && block.type !== "group"
  //           ? getBlocksAsArray(store.getState(), parent1!.groups || [])
  //           : [];
  //       return [parent1!].concat(parent1Groups);
  //     }

  //     return [parent0!].concat(parent0Groups);
  //   }
  // }

  // return [];
};

export default useBlockPossibleParents;
