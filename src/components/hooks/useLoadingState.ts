import React from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { ILoadingState } from "../../redux/key-value/types";
import { shouldLoadState } from "../../redux/operations/utils";
import { AppDispatch, IAppState } from "../../redux/types";
import cast from "../../utils/cast";

export interface IUseLoadingStateWithOpProps<L extends ILoadingState> {
  disableLoading?: boolean;
  key: string;
  initFn: (dispatch: AppDispatch) => void;
  decideShouldLoadState?: (loadingState?: L) => boolean;
}

export interface IUseLoadingStateWithOpResult<L extends ILoadingState> {
  loadingState?: L;
  markForLoading(): void;
}

export function useLoadingState<L extends ILoadingState>(key: string): L | undefined {
  const loadingState = useSelector<IAppState, ILoadingState | undefined>((state) => {
    return KeyValueSelectors.getByKey(state, key);
  });
  return cast<L | undefined>(loadingState);
}

export function useLoadingStateWithOp<L extends ILoadingState>(
  props: IUseLoadingStateWithOpProps<L>
): IUseLoadingStateWithOpResult<L> {
  const { key, initFn, disableLoading, decideShouldLoadState } = props;
  const dispatch = useDispatch();
  const loadingState = useLoadingState<L>(key);
  const shouldFetch = !disableLoading && (decideShouldLoadState ?? shouldLoadState)(loadingState);

  React.useEffect(() => {
    if (shouldFetch) {
      initFn(dispatch);
    }
  }, [shouldFetch, initFn, dispatch]);

  const markForLoading = () => {
    dispatch(
      KeyValueActions.mergeLoadingState({
        key,
        value: {
          error: undefined,
          initialized: false,
          isLoading: false,
        },
      })
    );
  };

  return { loadingState, markForLoading };
}
