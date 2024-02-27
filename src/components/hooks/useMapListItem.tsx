import React from "react";
import { useSelector } from "react-redux";
import { SystemResourceType } from "../../models/app/types";
import { IEndpointQueryPaginationOptions, IResourceWithId } from "../../models/types";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { ILoadingState } from "../../redux/key-value/types";
import MapsSelectors from "../../redux/maps/selectors";
import { IAppState } from "../../redux/types";

export interface IUseMapListItemProps {
  loadingKey: string;
  mapKey: SystemResourceType;
  customId: string;
  opAction: (arg: Required<IEndpointQueryPaginationOptions>) => any;
}

export function useMapListItem<T extends IResourceWithId>(props: IUseMapListItemProps) {
  const { loadingKey, mapKey, customId, opAction } = props;
  const loadingState = useSelector<IAppState, ILoadingState | undefined>((state) =>
    KeyValueSelectors.getByKey(state, loadingKey)
  );

  const isLoading = !loadingState || loadingState.isLoading;
  const error = loadingState && loadingState.error;
  const item = useSelector<IAppState, T | undefined>((state) =>
    MapsSelectors.getItem<T>(state, mapKey, customId)
  );

  let shouldLoad = false;
  if (!item) shouldLoad = true;
  React.useEffect(() => {
    if (shouldLoad && !isLoading && !error) opAction({ page: 1, pageSize: 1 });
  }, [shouldLoad, isLoading, error, opAction]);

  return { item, isLoading, error };
}
