import { noop } from "lodash";
import React from "react";
import { IAppWorkspace } from "../../models/organization/types";
import CollaborationRequestListContainer from "../collaborator/CollaborationRequestListContainer";
import ListHeader from "../utils/list/ListHeader";
import useOrganizationRequestForm from "./useOrganizationRequestForm";
import { organizationSidebarClasses } from "./utils";

export interface IWorkspaceSidebarRequestsProps {
  organization: IAppWorkspace;
}

const OrganizationSidebarRequests: React.FC<IWorkspaceSidebarRequestsProps> = (props) => {
  const { organization } = props;
  const [searchQuery, setSearchQuery] = React.useState("");
  const { formNode, openRequestForm } = useOrganizationRequestForm({
    organization,
  });

  // TODO: auth checks
  const canAddCollaborator = true;

  return (
    <div className={organizationSidebarClasses.root}>
      {formNode}
      <ListHeader
        hideAddButton={!canAddCollaborator}
        onCreate={openRequestForm}
        onSearchTextChange={setSearchQuery}
        searchInputPlaceholder={"Search requests..."}
        className={organizationSidebarClasses.header}
        title={"Requests"}
      />
      <div>
        <CollaborationRequestListContainer
          organizationId={organization.customId}
          searchQuery={searchQuery}
          onClickRequest={noop}
        />
      </div>
    </div>
  );
};

export default React.memo(OrganizationSidebarRequests);
