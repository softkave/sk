import { css } from "@emotion/css";
import React from "react";
import { useSelector } from "react-redux";
import SessionSelectors from "../../redux/session/selectors";
import PageMessage from "../PageMessage";
import LoadingEllipsis from "../utils/LoadingEllipsis";
import Scrollbar from "../utils/Scrollbar";
import ListHeader from "../utils/list/ListHeader";
import OrganizationForm from "./OrganizationForm";
import OrganizationList from "./OrganizationList";
import { useUserOrganizations } from "./useUserOrganizations";

export interface IWorkspaceListContainerProps {}

const classes = {
  root: css({
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
  }),
  header: css({ padding: "16px !important" }),
};

const OrganizationListContainer: React.FC<IWorkspaceListContainerProps> = (props) => {
  const {
    activeOrganizations,
    errorMessage,
    isLoading,
    organizations,
    selectedId,
    onSelectOrganization,
    setSearchQuery,
  } = useUserOrganizations();

  const isAnonymousUser = useSelector(SessionSelectors.isAnonymousUser);
  const [showNewOrgForm, setShowNewOrgForm] = React.useState(false);
  const toggleOrgForm = React.useCallback(() => setShowNewOrgForm((show) => !show), []);
  let listNode: React.ReactNode = null;

  if (isLoading) {
    listNode = <LoadingEllipsis />;
  } else if (errorMessage) {
    listNode = <PageMessage message={errorMessage}></PageMessage>;
  } else {
    listNode = (
      <Scrollbar>
        <OrganizationList
          selectable
          padItems
          organizations={activeOrganizations}
          selectedId={selectedId}
          onClickOrganization={onSelectOrganization}
        />
      </Scrollbar>
    );
  }

  return (
    <div className={classes.root}>
      {showNewOrgForm && <OrganizationForm onClose={toggleOrgForm} />}
      <ListHeader
        disabled={isLoading || isAnonymousUser}
        onSearchTextChange={setSearchQuery}
        className={classes.header}
        hideSearchButton={organizations.length === 0}
        title="Organizations"
        searchInputPlaceholder="Search organizations..."
        onCreate={toggleOrgForm}
      />
      {listNode}
    </div>
  );
};

export default React.memo(OrganizationListContainer);
