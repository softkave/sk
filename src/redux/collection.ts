import isArray from "lodash/isArray";
import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";

export interface IUpdateResourceMeta {
  arrayUpdateStrategy?: "merge" | "concat" | "replace";
}

export interface ICollectionItem<ResourceType> {
  resource: ResourceType;
}

export interface ICollectionMap<ResourceType> {
  [key: string]: ICollectionItem<ResourceType>;
}

export interface ICollectionAddItemPayload<ResourceType extends object> {
  id: string;
  data: ResourceType;
}

export interface ICollectionUpdateItemPayload<ResourceType extends object> {
  id: string;
  data: Partial<ResourceType>;
}

export interface ICollectionDeleteItemPayload {
  id: string;
}

export function bulkAddCollectionItems<ResourceType extends object>(
  resources: ICollectionMap<ResourceType>,
  params: Array<ICollectionAddItemPayload<ResourceType>>
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(param => {
    if (!param.data) {
      return;
    }

    const resource = merge(
      {},
      updatedResources[param.id] || {
        resource: param.data
      }
    );

    updatedResources[param.id] = resource;
  });

  return updatedResources;
}

export function bulkUpdateCollectionItems<ResourceType extends object>(
  resources: ICollectionMap<ResourceType>,
  params: Array<ICollectionUpdateItemPayload<ResourceType>>,
  meta: IUpdateResourceMeta
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(param => {
    if (!param.data) {
      return;
    }

    let resource = updatedResources[param.id];

    if (resource) {
      resource = merge({}, updatedResources[param.id]);
      resource.resource = mergeWith(
        {},
        resource.resource,
        param.data,
        (objValue, srcValue) => {
          if (isArray(objValue) && srcValue) {
            if (meta.arrayUpdateStrategy === "concat") {
              return objValue.concat(srcValue);
            } else if (meta.arrayUpdateStrategy === "replace") {
              return srcValue;
            }

            // merge arrayUpdateStrategy happens by default
          }
        }
      );

      updatedResources[param.id] = resource;
    }
  });

  return updatedResources;
}

export function bulkDeleteCollectionItems<ResourceType extends object>(
  resources: ICollectionMap<ResourceType>,
  params: ICollectionDeleteItemPayload[]
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(param => {
    const resource = updatedResources[param.id];

    if (resource) {
      delete updatedResources[param.id];
    }
  });

  return updatedResources;
}

export function getCollectionItem<ResourceType>(
  resources: ICollectionMap<ResourceType>,
  id: string
) {
  const resource = resources[id];

  if (resource) {
    return resource.resource;
  }
}

export function getCollectionItemsAsArray<ResourceType>(
  resources: ICollectionMap<ResourceType>,
  ids: string[] = []
) {
  return ids.reduce(
    (accumulator, id) => {
      const resource = resources[id];

      if (resource) {
        accumulator.push(resource.resource);
      }

      return accumulator;
    },
    [] as ResourceType[]
  );
}
