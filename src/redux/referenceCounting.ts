import merge from "lodash/merge";

export interface IReferenceCountedResource {
  referenceCount: number;
}

export interface IReferenceCountedNormalizedResources<
  ResourceType extends IReferenceCountedResource
> {
  [key: string]: ResourceType;
}

export interface IAddReferenceCountedResourceParams {
  id: string;
  resource: object;
}

export function bulkAddReferenceCountedResource<
  ResourceType extends IReferenceCountedResource
>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  params: IAddReferenceCountedResourceParams[]
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(param => {
    const resource = merge(
      {},
      updatedResources[param.id] || {
        ...param.resource,
        referenceCount: 0
      }
    );

    resource.referenceCount += 1;
    updatedResources[param.id] = resource;
  });

  return updatedResources;
}

export function bulkUpdateReferenceCountedResource<
  ResourceType extends IReferenceCountedResource
>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  params: IAddReferenceCountedResourceParams[]
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(param => {
    let resource = updatedResources[param.id];

    if (resource) {
      resource = merge({}, updatedResources[param.id], param.resource);
      updatedResources[param.id] = resource;
    }
  });

  return updatedResources;
}

export function bulkDeleteReferenceCountedResource<
  ResourceType extends IReferenceCountedResource
>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  params: string[]
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(id => {
    let resource = updatedResources[id];

    if (resource) {
      if (resource.referenceCount > 1) {
        resource = merge({}, updatedResources[id]);
        resource.referenceCount -= 1;
        updatedResources[id] = resource;
      } else {
        delete updatedResources[id];
      }
    }
  });

  return updatedResources;
}
