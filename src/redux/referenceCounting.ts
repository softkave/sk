import get from "lodash/get";
import merge from "lodash/merge";
import { AnyAction } from "redux";

// TODO: Rework the types and architecture

export interface IReferenceCountedResourceContainer<ResourceType> {
  referenceCount: number;
  resource: ResourceType;
}

export interface IReferenceCountedNormalizedResources<ResourceType> {
  [key: string]: IReferenceCountedResourceContainer<ResourceType>;
}

export interface IReferenceCountedResourceAddPayload<
  ResourceType extends object
> {
  id: string;
  data: ResourceType;
}

export interface IReferenceCountedResourceUpdatePayload<
  ResourceType extends object
> {
  id: string;
  data: Partial<ResourceType>;
}

export interface IReferenceCountedResourceDeletePayload {
  id: string;
}

export function bulkAddReferenceCountedResources<ResourceType extends object>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  params: Array<IReferenceCountedResourceAddPayload<ResourceType>>
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
        resource: param.data,
        referenceCount: 0
      }
    );

    resource.referenceCount += 1;
    updatedResources[param.id] = resource;
  });

  return updatedResources;
}

export function bulkUpdateReferenceCountedResources<
  ResourceType extends object
>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  params: Array<IReferenceCountedResourceUpdatePayload<ResourceType>>
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
      resource.resource = merge({}, resource.resource, param.data);
      updatedResources[param.id] = resource;
    }
  });

  return updatedResources;
}

export function bulkDeleteReferenceCountedResources<
  ResourceType extends object
>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  params: IReferenceCountedResourceDeletePayload[]
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(param => {
    let resource = updatedResources[param.id];

    if (resource) {
      if (resource.referenceCount > 1) {
        resource = merge({}, updatedResources[param.id]);
        resource.referenceCount -= 1;
        updatedResources[param.id] = resource;
      } else {
        delete updatedResources[param.id];
      }
    }
  });

  return updatedResources;
}

export function getResource<ResourceType>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  id: string
) {
  const resource = resources[id];

  if (resource) {
    return resource.resource;
  }
}

export function getResourcesAsArray<ResourceType>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  ids: string[]
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

export function getResourceParam<ResourceType extends object>(
  data: ResourceType,
  idPropName: string
) {
  return {
    data,
    id: get(data, idPropName)
  };
}

export function getResourceParamArray<ResourceType extends object>(
  resources: ResourceType[],
  idPropName: string
) {
  return resources.map(resource => {
    return getResourceParam(resource, idPropName);
  });
}
