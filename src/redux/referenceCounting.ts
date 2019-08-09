import merge from "lodash/merge";
import { AnyAction } from "redux";
import { IReduxState } from "./store";

export interface IReferenceCountedResourceContainer<ResourceType> {
  referenceCount: number;
  resource: ResourceType;
}

export interface IReferenceCountedNormalizedResources<ResourceType> {
  [key: string]: IReferenceCountedResourceContainer<ResourceType>;
}

export interface IReferenceCountedResourceOperationParams<ResourceType> {
  id: string;
  resource?: ResourceType;
}

export function bulkAddReferenceCountedResources<ResourceType extends object>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  params: Array<IReferenceCountedResourceOperationParams<ResourceType>>
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(param => {
    if (!param.resource) {
      return;
    }

    const resource = merge(
      {},
      updatedResources[param.id] || {
        resource: param.resource,
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
  params: Array<IReferenceCountedResourceOperationParams<ResourceType>>
) {
  if (params.length === 0) {
    return resources;
  }

  const updatedResources = { ...resources };

  params.forEach(param => {
    if (!param.resource) {
      return;
    }

    let resource = updatedResources[param.id];

    if (resource) {
      resource = merge({}, updatedResources[param.id]);
      resource.resource = merge({}, resource.resource, param.resource);
      updatedResources[param.id] = resource;
    }
  });

  return updatedResources;
}

export function bulkDeleteReferenceCountedResources<
  ResourceType extends object
>(
  resources: IReferenceCountedNormalizedResources<ResourceType>,
  params: Array<IReferenceCountedResourceOperationParams<ResourceType>>
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

interface IBulkReferenceCountedResourceAction<
  ActionType,
  ResourceType,
  PayloadType extends Array<
    IReferenceCountedResourceOperationParams<ResourceType>
  > = Array<IReferenceCountedResourceOperationParams<ResourceType>>
> extends AnyAction {
  type: ActionType;
  payload: PayloadType;
}

export type IBulkReferenceCountedResourceActions<
  ResourceType,
  AddType,
  UpdateType,
  DeleteType
> =
  | IBulkReferenceCountedResourceAction<
      AddType,
      ResourceType,
      Array<IReferenceCountedResourceOperationParams<ResourceType>>
    >
  | IBulkReferenceCountedResourceAction<
      UpdateType,
      ResourceType,
      Array<IReferenceCountedResourceOperationParams<ResourceType>>
    >
  | IBulkReferenceCountedResourceAction<
      DeleteType,
      ResourceType,
      Array<IReferenceCountedResourceOperationParams<ResourceType>>
    >;

/**
 * You can supply the arguments without the types, but the types will be inferred as strings.
 * To get the exact types, supply the arguments and the types.
 */

export function makeReferenceCountedResourceActions<
  ResourceType extends object,
  AddType extends string,
  UpdateType extends string,
  DeleteType extends string
>(addType: AddType, updateType: UpdateType, deleteType: DeleteType) {
  type AddActionParamsType = IReferenceCountedResourceOperationParams<
    ResourceType
  >;
  type DeleteActionParamsType = IReferenceCountedResourceOperationParams<
    ResourceType
  >;
  type ActionsType = IBulkReferenceCountedResourceActions<
    ResourceType,
    AddType,
    UpdateType,
    DeleteType
  >;

  return {
    /**
     * Do not use this object directly, it is meant for getting a union of the action types.
     * Like type IExampleActions = typeof actions.actionsTypes
     */
    actionTypes: {} as ActionsType,

    addResource(resource: AddActionParamsType) {
      return this.bulkAddResources([resource]);
    },

    updateResource(resource: AddActionParamsType) {
      return this.bulkUpdateResources([resource]);
    },

    deleteResource(resource: DeleteActionParamsType) {
      return this.bulkDeleteResources([resource]);
    },

    bulkAddResources(
      resources: AddActionParamsType[]
    ): IBulkReferenceCountedResourceAction<AddType, ResourceType> {
      return {
        type: addType,
        payload: resources
      };
    },

    bulkUpdateResources(
      resources: AddActionParamsType[]
    ): IBulkReferenceCountedResourceAction<UpdateType, ResourceType> {
      return {
        type: updateType,
        payload: resources
      };
    },

    bulkDeleteResources(
      resources: DeleteActionParamsType[]
    ): IBulkReferenceCountedResourceAction<DeleteType, ResourceType> {
      return {
        type: deleteType,
        payload: resources
      };
    }
  };
}

export function makeReferenceCountedResourcesReducer<
  ResourceType extends object,
  AddType extends string,
  UpdateType extends string,
  DeleteType extends string
>(addType: AddType, updateType: UpdateType, deleteType: DeleteType) {
  type ResourcesType = IReferenceCountedNormalizedResources<ResourceType>;
  type ActionTypes = IBulkReferenceCountedResourceActions<
    ResourceType,
    AddType,
    UpdateType,
    DeleteType
  >;

  function referenceCountedResourceReducer(
    state: ResourcesType = {},
    action: ActionTypes
  ): ResourcesType {
    switch (action.type) {
      case addType: {
        return bulkAddReferenceCountedResources(state, action.payload as Array<
          IReferenceCountedResourceOperationParams<ResourceType>
        >);
      }

      case updateType: {
        return bulkUpdateReferenceCountedResources(
          state,
          action.payload as Array<
            IReferenceCountedResourceOperationParams<ResourceType>
          >
        );
      }

      case deleteType: {
        return bulkDeleteReferenceCountedResources(state, action.payload);
      }

      default:
        return state;
    }
  }

  return {
    resourcesType: {} as ResourcesType,
    reducer: referenceCountedResourceReducer
  };
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
