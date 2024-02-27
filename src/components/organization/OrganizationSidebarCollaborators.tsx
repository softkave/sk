import { noop } from "lodash";
import React from "react";
import { IAppWorkspace } from "../../models/organization/types";
import CollaboratorList from "../collaborator/CollaboratorList";
import ListHeader from "../utils/list/ListHeader";
import useOrganizationRequestForm from "./useOrganizationRequestForm";
import { organizationSidebarClasses } from "./utils";

export interface IWorkspaceSidebarCollaboratorsProps {
  organization: IAppWorkspace;
}

const OrganizationSidebarCollaborators: React.FC<IWorkspaceSidebarCollaboratorsProps> = (props) => {
  const { organization } = props;
  const { formNode, openRequestForm } = useOrganizationRequestForm({
    organization,
  });

  // TODO: auth checks
  const canAddCollaborator = true;

  return (
    <div className={organizationSidebarClasses.root}>
      {formNode}
      <ListHeader
        hideSearchButton
        hideAddButton={!canAddCollaborator}
        onCreate={openRequestForm}
        onSearchTextChange={noop}
        searchInputPlaceholder={"Search collaborators..."}
        className={organizationSidebarClasses.header}
        title={"Collaborators"}
      />
      <div>
        <CollaboratorList padItems ids={organization.collaboratorIds} />
      </div>
    </div>
  );
};

export default React.memo(OrganizationSidebarCollaborators);
