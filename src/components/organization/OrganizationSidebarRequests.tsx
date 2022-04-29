import React from "react";
import { IAppOrganization } from "../../models/organization/types";
import ListHeader from "../utilities/ListHeader";
import { organizationSidebarClasses } from "./utils";
import CollaborationRequestListContainer from "../collaborator/CollaborationRequestListContainer";
import { noop } from "lodash";
import useOrganizationRequestForm from "./useOrganizationRequestForm";

export interface IOrganizationSidebarRequestsProps {
  organization: IAppOrganization;
}

const OrganizationSidebarRequests: React.FC<
  IOrganizationSidebarRequestsProps
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
        placeholder={"Search requests..."}
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
