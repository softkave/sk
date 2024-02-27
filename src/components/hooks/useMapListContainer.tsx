import { isNumber } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { SystemResourceType } from "../../models/app/types";
import { IEndpointQueryPaginationOptions, IResourceWithId } from "../../models/types";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { ExtractLoadingStateValue, ILoadingStateLoadingList } from "../../redux/key-value/types";
import MapsSelectors from "../../redux/maps/selectors";
import { IAppState } from "../../redux/types";
import { IAppError } from "../../utils/errors";
import { useAppDispatch } from "./redux";
import { IUseLoadingStateWithOpResult } from "./useLoadingState";

export interface IUseMapListContainerExportedProps {
  disableLoading?: boolean;
  omitItems?: boolean;
}

export interface IUseMapListContainerProps extends IUseMapListContainerExportedProps {
  loadingKey: string;
  mapKey: SystemResourceType;
  opAction: (arg: Required<IEndpointQueryPaginationOptions>) => any;
}

export interface IUseMapListContainerResult<
  T extends IResourceWithId,
  L extends ILoadingStateLoadingList = ILoadingStateLoadingList
> extends IUseLoadingStateWithOpResult<L> {
  page: number;
  pageSize: number;
  count: number | undefined;
  items: T[] | undefined;
  shouldRenderLoading: boolean;
  error: IAppError[] | undefined | null;
  value?: ExtractLoadingStateValue<L>;
  loadingState?: L;
  markForLoading(): void;
  // setPage: React.Dispatch<React.SetStateAction<number>>;
  setPage: (page: number) => void;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

export interface IUseMapListContainerNotPaginatedResult<
  T extends IResourceWithId,
  L extends ILoadingStateLoadingList = ILoadingStateLoadingList
> {
  count: number | undefined;
  items: T[] | undefined;
  shouldRenderLoading: boolean | undefined;
  error: IAppError[] | undefined | null;
  value?: ExtractLoadingStateValue<L>;
  loadingState?: L;
  markForLoading(): void;
}

export interface IUseMapListContainerNotPaginatedExportedProps {
  omitItems?: boolean;
  disableLoading?: boolean;
}

export interface IUseMapListContainerNotPaginatedProps
  extends IUseMapListContainerNotPaginatedExportedProps {
  loadingKey: string;
  mapKey: SystemResourceType;
  opAction: () => any;
}

export function useMapListContainer<
  T extends IResourceWithId,
  L extends ILoadingStateLoadingList = ILoadingStateLoadingList
>(props: IUseMapListContainerProps): IUseMapListContainerResult<T, L> {
  const { loadingKey, mapKey, omitItems, disableLoading, opAction } = props;
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const loadingState = useSelector<IAppState, L | undefined>((state) =>
    KeyValueSelectors.getByKey(state, loadingKey)
  );

  const idList = loadingState?.value?.idList;
  const count = loadingState?.value?.count;
  const shouldRenderLoading = !loadingState || !!loadingState.isLoading;
  const error = loadingState && loadingState.error;
  const items = useSelector<IAppState, T[] | undefined>((state) =>
    idList && !omitItems
      ? MapsSelectors.getList<T>(state, mapKey, idList, page * pageSize, pageSize)
      : undefined
  );

  let shouldLoad = false;
  if (!items && !omitItems) {
    shouldLoad = true;
  } else if (items && isNumber(count)) {
    const fullPages = Math.floor(count / pageSize);
    const lastPageCount = count - fullPages * pageSize;
    shouldLoad = page < fullPages ? items.length < pageSize : items.length < lastPageCount;
  }

  shouldLoad = shouldLoad && !loadingState?.isLoading && !error && !disableLoading;

  React.useEffect(() => {
    if (shouldLoad) {
      opAction({ page, pageSize });
    }
  }, [shouldLoad, page, pageSize, opAction]);

  const dispatch = useAppDispatch();
  const markForLoading = () => {
    dispatch(
      KeyValueActions.mergeLoadingState({
        key: loadingKey,
        value: {
          error: null,
          initialized: false,
          isLoading: false,
          value: null,
        },
      })
    );
  };

  return {
    loadingState,
    pageSize,
    count,
    items,
    shouldRenderLoading,
    error,
    markForLoading,
    setPageSize,
    page: page + 1, // internal page state is zero based, but consumers are not
    setPage: (p: number) => setPage(p - 1),
    value: loadingState?.value as ExtractLoadingStateValue<L>,
  };
}

export function useMapListContainerNotPaginated<
  T extends IResourceWithId,
  L extends ILoadingStateLoadingList = ILoadingStateLoadingList
>(props: IUseMapListContainerNotPaginatedProps): IUseMapListContainerNotPaginatedResult<T, L> {
  const { loadingKey, mapKey, omitItems, disableLoading, opAction } = props;
  const loadingState = useSelector<IAppState, L | undefined>((state) =>
    KeyValueSelectors.getByKey(state, loadingKey)
  );

  const shouldRenderLoading = !loadingState || loadingState.isLoading;
  const error = loadingState && loadingState.error;
  const items = useSelector<IAppState, T[] | undefined>((state) =>
    loadingState?.value?.idList && !omitItems
      ? MapsSelectors.getList<T>(state, mapKey, loadingState.value.idList)
      : undefined
  );

  let shouldLoad = false;
  if (!items && !omitItems) {
    shouldLoad = true;
  }

  shouldLoad = shouldLoad && !loadingState?.isLoading && !error && !disableLoading;
  React.useEffect(() => {
    if (shouldLoad) {
      opAction();
    }
  }, [shouldLoad, opAction]);

  const dispatch = useAppDispatch();
  const markForLoading = () => {
    dispatch(
      KeyValueActions.mergeLoadingState({
        key: loadingKey,
        value: {
          error: null,
          initialized: false,
          isLoading: false,
          value: null,
        },
      })
    );
  };

  return {
    items,
    shouldRenderLoading,
    error,
    loadingState,
    markForLoading,
    count: loadingState?.value?.count,
    value: loadingState?.value as ExtractLoadingStateValue<L>,
  };
}
