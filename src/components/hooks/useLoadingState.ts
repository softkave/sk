import { useSelector } from "react-redux";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { ILoadingState } from "../../redux/key-value/types";
import { IAppState } from "../../redux/types";

export default function useLoadingState(
  key?: string
): ILoadingState | undefined {
  const loadingState = useSelector<IAppState, ILoadingState | undefined>(
    (state) => (key ? KeyValueSelectors.getKey(state, key) : undefined)
  );

  return loadingState;
}
