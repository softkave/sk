import { css } from "@emotion/css";
import { noop } from "lodash";
import React from "react";
import PageMessage from "../PageMessage";
import LoadingEllipsis from "../utils/LoadingEllipsis";
import ListHeader from "../utils/list/ListHeader";
import RequestList from "./RequestList";
import { useUserRequests } from "./useUserRequests";

export interface IRequestListContainerProps {}

const classes = {
  root: css({
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    padding: "8px 0px",
  }),
  header: css({ padding: "0px 16px 16px 16px !important" }),
};

const RequestListContainer: React.FC<IRequestListContainerProps> = (props) => {
  const {
    errorMessage,
    isLoading,
    requests,
    selectedId,
    activeRequests,
    onSelectRequest,
    setSearchQuery,
  } = useUserRequests();

  let listNode: React.ReactNode = null;

  if (isLoading) {
    listNode = <LoadingEllipsis />;
  } else if (errorMessage) {
    listNode = <PageMessage message={errorMessage}></PageMessage>;
  } else {
    listNode = (
      <RequestList
        requests={activeRequests}
        selectedId={selectedId}
        onClickRequest={onSelectRequest}
      />
    );
  }

  return (
    <div className={classes.root}>
      <ListHeader
        hideAddButton
        disabled={isLoading}
        onSearchTextChange={setSearchQuery}
        hideSearchButton={requests.length === 0}
        onCreate={noop}
        title="Collaboration Requests"
        searchInputPlaceholder="Search requests..."
        className={classes.header}
      />
      {listNode}
    </div>
  );
};

export default React.memo(RequestListContainer);
