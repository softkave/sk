import { SystemResourceType } from "../../models/app/types";
import { IResourceWithId } from "../../models/types";

export type IMapsKeyValue<T extends IResourceWithId = IResourceWithId> = Record<string, T>;
export type IMapsState = Record<SystemResourceType, IMapsKeyValue>;
