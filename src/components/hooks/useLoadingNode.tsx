import React from "react";
import { ILoadingState } from "../../redux/key-value/types";
import { IAppError } from "../../utils/errors";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utils/LoadingEllipsis";

export function useLoadingNode(...loadingStates: Array<ILoadingState | undefined>) {
  let isLoading = false;
  let errors: Array<IAppError> = [];
  loadingStates.forEach((state) => {
    isLoading = isLoading || !state || !!state.isLoading;
    if (state?.error) {
      errors = errors.concat(state.error);
    }
  });

  let stateNode: React.ReactNode = null;
  if (errors.length > 0) {
    stateNode = <MessageList maxWidth shouldFillParent messages={errors} />;
  } else if (isLoading) {
    stateNode = <LoadingEllipsis />;
  }

  return { stateNode };
}
