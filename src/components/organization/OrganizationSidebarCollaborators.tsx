import React from "react";
import { IAppOrganization } from "../../models/organization/types";
import ListHeader from "../utilities/ListHeader";
import { organizationSidebarClasses } from "./utils";
import CollaboratorList from "../collaborator/CollaboratorList";
import useOrganizationRequestForm from "./useOrganizationRequestForm";

export interface IOrganizationSidebarCollaboratorsProps {
  organization: IAppOrganization;
}

const OrganizationSidebarCollaborators: React.FC<
  IOrganizationSidebarCollaboratorsProps
> = (props) => {
  const { organization } = props;
  const [searchQuery, setSearchQuery] = React.useState("");
  const { formNode, openRequestForm } = useOrganizationRequestForm({
    organization,
  });

  return (
    <div className={organizationSidebarClasses.list}>
      {formNode}
      <ListHeader
        onCreate={openRequestForm}
        onSearchTextChange={setSearchQuery}
        placeholder={"Search collaborators..."}
        className={organizationSidebarClasses.header}
        title={"Collaborators"}
      />
      <div>
        <CollaboratorList
          organization={organization}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default React.memo(OrganizationSidebarCollaborators);
