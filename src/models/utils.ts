import { first, isArray } from "lodash";
import { indexArray } from "../utils/utils";
import { IBlock } from "./block/block";
import { INotification } from "./notification/notification";
import { ICollaborator } from "./user/user";

export function getComplexFieldInput<T extends object>(
  arr: T[],
  data: T[],
  indexPath: T extends object ? keyof T : never,
  reducer: (data: T | T) => T | T,
  check: (d0: T, d1: T) => boolean,
  extract: (d: T | T) => T
) {
  const add: T[] = [];
  const remove: string[] = [];
  const update: T[] = [];
  const existingItemsMap = indexArray(arr || [], {
    reducer,
    path: indexPath,
  });

  const dataMap = indexArray(data || [], { reducer, path: indexPath });
  (data || []).forEach((item) => {
    const key = item[indexPath] as any;
    const existingItem = existingItemsMap[key];

    if (!existingItem) {
      add.push(extract(item));
    } else {
      if (check(existingItem as T, item)) {
        update.push(extract(item));
      }
    }
  });

  (arr || []).forEach((item) => {
    if (!dataMap[item[indexPath] as any]) {
      remove.push(item[indexPath] as any);
    }
  });

  return {
    add: add.length > 0 ? add : undefined,
    remove: remove.length > 0 ? remove : undefined,
    update: update.length > 0 ? update : undefined,
  };
}

export function getNameInitials(name: string) {
  const nameSplit = name.split(" ");
  const initials = nameSplit
    .slice(0, 3)
    .map((name) => name[0])
    .join("");
  return initials.toUpperCase();
}

export function getOrganizationPath(org: IBlock) {
  return `/app/orgs/${org.customId}`;
}

export function getOrgBoardsPath(org: IBlock) {
  return `${getOrganizationPath(org)}/boards`;
}

export function getBoardPath(org: IBlock, board: IBlock) {
  return `${getOrganizationPath(org)}/boards/${board.customId}`;
}

export function getOrgTokensPath(org: IBlock) {
  return `${getOrganizationPath(org)}/programAccessTokens`;
}

export function getOrgRequestsPath(org: IBlock) {
  return `${getOrganizationPath(org)}/collaborationRequests`;
}

export function getRequestPath(org: IBlock, request: INotification) {
  return `${getOrganizationPath(org)}/collaborationRequests/${
    request.customId
  }`;
}

export function getOrgCollaboratorsPath(org: IBlock) {
  return `${getOrganizationPath(org)}/collaborators`;
}

export function getCollaboratorPath(org: IBlock, user: ICollaborator) {
  return `${getOrganizationPath(org)}/collaborators/${user.customId}`;
}

export function getUserNotificationPath(notification: INotification) {
  return `/app/notifications/${notification.customId}`;
}

export function getUserRequestPath(request: INotification) {
  return `/app/collaborationRequests/${request.customId}`;
}

export function getFirstError(error: any): { message?: string } | undefined {
  if (error?.message) {
    return error;
  } else if (isArray(error)) {
    const item = first(error);
    if (item?.message) {
      return item;
    }
  }
}
