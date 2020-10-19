import forEach from "lodash/forEach";
import { BlockType, IBlock } from "../../models/block/block";
import { IAppState } from "../types";

function getBlock(state: IAppState, blockId: string) {
    return state.blocks[blockId];
}

function getBlocksAsArray(state: IAppState, ids: string[]) {
    return ids.reduce((blocks, id) => {
        if (state.blocks[id]) {
            blocks.push(state.blocks[id]);
        }

        return blocks;
    }, [] as IBlock[]);
}

function getOrgTasks(state: IAppState, org: IBlock) {
    const blocks: IBlock[] = [];

    Object.keys(state.blocks).forEach((id) => {
        const block = state.blocks[id];

        if (
            BlockType.Task === block.type &&
            org.customId === block.rootBlockId
        ) {
            blocks.push(block);
        }
    });

    return blocks;
}

function getBlockChildren(state: IAppState, parent: IBlock, type?: BlockType) {
    const blocks: IBlock[] = [];

    Object.keys(state.blocks).forEach((id) => {
        const block = state.blocks[id];

        if (type && type !== block.type) {
            return;
        }

        if (parent.customId === block.parent) {
            blocks.push(block);
        }
    });

    return blocks;
}

function getBlockParents(state: IAppState, block: IBlock) {
    let b: IBlock = block;
    const parents: IBlock[] = [];

    while (b && b.type !== "org") {
        // TODO: currently assumes that the parent exists
        const parent = getBlock(state, b.parent!)!;
        parents.unshift(parent);
        b = parent;
    }

    return parents;
}

function getSprintTasks(state: IAppState, sprintId: string): IBlock[] {
    const tasks: IBlock[] = [];

    forEach(state.blocks, (block) => {
        if (block.taskSprint?.sprintId === sprintId) {
            tasks.push(block);
        }
    });

    return tasks;
}

export default class BlockSelectors {
    public static getBlock = getBlock;
    public static getBlocks = getBlocksAsArray;
    public static getOrgTasks = getOrgTasks;
    public static getBlockChildren = getBlockChildren;
    public static getBlockParents = getBlockParents;
    public static getSprintTasks = getSprintTasks;
}
