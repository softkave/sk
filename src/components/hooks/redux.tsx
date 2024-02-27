import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, IAppState } from "../../redux/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IAppState> = useSelector;
