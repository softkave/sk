import { IRoomLikeResource, ResourceType } from "../../redux/key-value/types";
import ErrorMessages from "../messages";

export function getRoomId(res: IRoomLikeResource): string {
  let id = `${res.type}-${res.customId}`;

  if (res.subRoom) {
    id += `-${res.subRoom}`;
  }

  return id;
}

export function getRoomLikeResource(signature: string): IRoomLikeResource {
  const split = signature.split("-");

  if (split.length < 1) {
    throw new Error(ErrorMessages.AN_ERROR_OCCURRED);
  }

  const type = split.shift();
  const resourceId = split.join("-"); // we use uuids, and they ( uuid ) use '-'
  return { type: type as unknown as ResourceType, customId: resourceId };
}
