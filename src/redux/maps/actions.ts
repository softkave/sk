import { createAction } from "@reduxjs/toolkit";
import { SystemResourceType } from "../../models/app/types";
import { IResourceWithId } from "../../models/types";
import { IMergeDataMeta } from "../../utils/utils";

const setList = createAction<{ key: SystemResourceType; list: IResourceWithId[] }>("maps/setList");
const setManyLists =
  createAction<Partial<Record<SystemResourceType, IResourceWithId[]>>>("maps/setManyLists");
const deleteList = createAction<{ key: SystemResourceType; list: IResourceWithId[] }>(
  "maps/deleteList"
);
const updateListWithMeta = createAction<{
  key: SystemResourceType;
  list: IResourceWithId[];
  meta?: IMergeDataMeta;
}>("maps/updateListWithMeta");

export class MapsActions {
  static setList = setList;
  static setManyLists = setManyLists;
  static deleteList = deleteList;
  static updateListWithMeta = updateListWithMeta;
}
