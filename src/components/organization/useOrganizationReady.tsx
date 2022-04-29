import React from "react";
import { useSelector } from "react-redux";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import { UnknownError } from "../../utils/errors";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import { useLoadOrgData } from "./useLoadOrgData";
import { useUserOrganizations } from "./useUserOrganizations";

const useOrganizationReady = () => {
  const rootBlocksLoaded = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.RootBlocksLoaded)
  );
  const { errorMessage, isLoading } = useUserOrganizations();
  const state = useLoadOrgData();
  let returnNode: React.ReactNode = null;

  if (state.error || errorMessage) {
    returnNode = (
      <MessageList
        fill
        messages={
          state.error || [{ message: errorMessage!, name: UnknownError.name }]
        }
      />
    );
  } else if (state.isLoading || isLoading || !rootBlocksLoaded) {
    console.log({ state, isLoading, rootBlocksLoaded });
    returnNode = <LoadingEllipsis />;
  }

  return { returnNode };
};

export default useOrganizationReady;
