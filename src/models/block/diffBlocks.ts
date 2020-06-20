import defaultTo from "lodash/defaultTo";
import { IBlock, IBlockStatus, ISubTask, ITaskAssignee } from "./block";

export function diffOrg(initial: IBlock, current: IBlock) {
  if (initial.customId !== current.customId) {
    return current;
  }

  const diff: Partial<IBlock> = {};
  let hasChanges = false;

  if (initial.name !== current.name) {
    diff.name = current.name;
    hasChanges = true;
  }

  if (initial.description !== current.description) {
    diff.description = current.description;
    hasChanges = true;
  }

  if (initial.color !== current.color) {
    diff.color = current.color;
    hasChanges = true;
  }

  if (hasChanges) {
    return diff;
  }

  return null;
}

export function diffTaskAssigneesList(
  initial: ITaskAssignee[],
  current: ITaskAssignee[]
) {
  const diff: Array<Partial<ITaskAssignee>> = [];
  let hasChanges = false;
  const length =
    initial.length > current.length ? initial.length : current.length;

  for (let i = 0; i < length; i++) {
    const initialAssignee = initial[i];
    const currentAssignee = current[i];

    if (!initialAssignee) {
      diff[i] = currentAssignee;
      hasChanges = true;
      return;
    }

    if (!currentAssignee) {
      diff[i] = initialAssignee;
      hasChanges = true;
      return;
    }

    if (initialAssignee.userId !== currentAssignee.userId) {
      diff[i] = currentAssignee;
      hasChanges = true;
      return;
    }
  }

  if (hasChanges) {
    return diff;
  }

  return null;
}

export function diffSubTask(initial: ISubTask, current: ISubTask) {
  if (initial.customId !== current.customId) {
    return current;
  }

  const diff: Partial<ISubTask> = {};
  let hasChanges = false;

  if (initial.description !== current.description) {
    diff.description = current.description;
    hasChanges = true;
  }

  if (initial.updatedAt !== current.updatedAt) {
    diff.updatedAt = current.updatedAt;
    hasChanges = true;
  }

  if (initial.updatedBy !== current.updatedBy) {
    diff.updatedBy = current.updatedBy;
    hasChanges = true;
  }

  if (initial.completedAt !== current.completedAt) {
    diff.completedAt = current.completedAt;
    hasChanges = true;
  }

  if (initial.completedBy !== current.completedBy) {
    diff.completedBy = current.completedBy;
    hasChanges = true;
  }

  if (hasChanges) {
    return diff;
  }

  return null;
}

export function diffSubTasksList(initial: ISubTask[], current: ISubTask[]) {
  const diff: Array<Partial<ISubTask>> = [];
  let hasChanges = false;
  const length =
    initial.length > current.length ? initial.length : current.length;

  for (let i = 0; i < length; i++) {
    const initialSubTask = initial[i];
    const currentSubTask = current[i];

    if (!initialSubTask) {
      diff[i] = currentSubTask;
      hasChanges = true;
      return;
    }

    if (!currentSubTask) {
      diff[i] = initialSubTask;
      hasChanges = true;
      return;
    }

    const changes = diffSubTask(initialSubTask, currentSubTask);

    if (changes) {
      diff[i] = changes;
      hasChanges = true;
      return;
    }
  }

  if (hasChanges) {
    return diff;
  }

  return null;
}

export function diffStatus(initial: IBlockStatus, current: IBlockStatus) {
  if (initial.customId !== current.customId) {
    return current;
  }

  const diff: Partial<IBlockStatus> = {};
  let hasChanges = false;

  if (initial.name !== current.name) {
    diff.name = current.name;
    hasChanges = true;
  }

  if (initial.color !== current.color) {
    diff.color = current.color;
    hasChanges = true;
  }

  if (initial.description !== current.description) {
    diff.description = current.description;
    hasChanges = true;
  }

  if (initial.updatedAt !== current.updatedAt) {
    diff.updatedAt = current.updatedAt;
    hasChanges = true;
  }

  if (initial.updatedBy !== current.updatedBy) {
    diff.updatedBy = current.updatedBy;
    hasChanges = true;
  }

  if (hasChanges) {
    return diff;
  }

  return null;
}

export function diffStatusList(
  initial: IBlockStatus[],
  current: IBlockStatus[]
) {
  const diff: Array<Partial<IBlockStatus>> = [];
  let hasChanges = false;
  const length =
    initial.length > current.length ? initial.length : current.length;

  for (let i = 0; i < length; i++) {
    const initialStatus = initial[i];
    const currentStatus = current[i];

    if (!initialStatus) {
      diff[i] = currentStatus;
      hasChanges = true;
      return;
    }

    if (!currentStatus) {
      diff[i] = initialStatus;
      hasChanges = true;
      return;
    }

    const changes = diffStatus(initialStatus, currentStatus);

    if (changes) {
      diff[i] = changes;
      hasChanges = true;
      return;
    }
  }

  if (hasChanges) {
    return diff;
  }

  return null;
}

export function diffTask(initial: IBlock, current: IBlock) {
  if (initial.customId !== current.customId) {
    return current;
  }

  const diff: Partial<IBlock> = {};
  let hasChanges = false;

  if (initial.description !== current.description) {
    diff.description = current.description;
    hasChanges = true;
  }

  if (initial.dueAt !== current.dueAt) {
    diff.dueAt = current.dueAt;
    hasChanges = true;
  }

  if (initial.parent !== current.parent) {
    diff.parent = current.parent;
    hasChanges = true;
  }

  if (
    diffTaskAssigneesList(
      defaultTo(initial.assignees, []),
      defaultTo(current.assignees, [])
    )
  ) {
    diff.assignees = current.assignees;
  }

  if (initial.priority !== current.priority) {
    diff.priority = current.priority;
    hasChanges = true;
  }

  if (
    diffSubTasksList(
      defaultTo(initial.subTasks, []),
      defaultTo(current.subTasks, [])
    )
  ) {
    diff.subTasks = current.subTasks;
    hasChanges = true;
  }

  if (initial.status !== current.status) {
    diff.status = current.status;
    diff.statusAssignedAt = current.statusAssignedAt;
    diff.statusAssignedBy = current.statusAssignedBy;
    hasChanges = true;
  }

  if (hasChanges) {
    return diff;
  }

  return null;
}
