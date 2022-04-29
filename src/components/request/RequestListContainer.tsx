import { css } from "@emotion/css";
import { noop } from "lodash";
import React from "react";
import PageError from "../Message";
import ListHeader from "../utilities/ListHeader";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import RequestList from "./RequestList";
import { useUserRequests } from "./useUserRequests";

export interface IRequestListContainerProps {}

const classes = {
  root: css({
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
  }),
  header: css({ paddingBottom: "8px", paddingTop: "8px" }),
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
    listNode = <PageError message={errorMessage}></PageError>;
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
        className={classes.header}
        hideSearchButton={requests.length === 0}
        onCreate={noop}
        title="Collaboration Requests"
        placeholder="Search requests..."
      />
      {listNode}
    </div>
  );
};

export default React.memo(RequestListContainer);
