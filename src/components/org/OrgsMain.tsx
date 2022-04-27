import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { IAppOrganization } from "../../models/organization/types";
import { IUnseenChatsCountByOrg } from "../../redux/key-value/types";
import GeneralError from "../Message";

import OrgsList from "./OrgsList";
import OrgsListHeader from "./OrgsListHeader";

export interface IOrgsMainProps {
  orgs: IAppOrganization[];
  requests: ICollaborationRequest[];
  unseenChatsCountMapByOrg: IUnseenChatsCountByOrg;
  onAddOrg: () => void;
  onSelectOrg: (org: IAppOrganization) => void;
  onSelectRequest: (request: ICollaborationRequest) => void;

  isLoading?: boolean;
  errorMessage?: string;
  selectedId?: string;
}

const OrgsMain: React.FC<IOrgsMainProps> = (props) => {
  const {
    orgs,
    isLoading,
    errorMessage,
    selectedId,
    requests,
    unseenChatsCountMapByOrg,
    onAddOrg,
    onSelectOrg,
    onSelectRequest,
  } = props;

  const [searchQuery, setSearchQuery] = React.useState("");
  const renderContent = () => {
    if (isLoading) {
      return null;
    }

    if (errorMessage) {
      return <GeneralError message={errorMessage}></GeneralError>;
    }

    let compOrgs = orgs;
    let compRequests = requests;

    if (searchQuery) {
      const searchTextLower = searchQuery.toLowerCase();
      compOrgs = orgs.filter((org) => {
        return org.name?.toLowerCase().includes(searchTextLower);
      });

      compRequests = requests.filter((request) => {
        return request.from?.blockName.toLowerCase().includes(searchTextLower);
      });
    }

    return (
      <OrgsList
        orgs={compOrgs}
        requests={compRequests}
        unseenChatsCountMapByOrg={unseenChatsCountMapByOrg}
        selectedId={selectedId}
        onClickOrganization={onSelectOrg}
        onClickRequest={onSelectRequest}
      />
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <OrgsListHeader
        onClickCreate={onAddOrg}
        onSearchTextChange={setSearchQuery}
        style={{ paddingBottom: "8px", paddingTop: "8px" }}
        placeholder="Search orgs and requests..."
        title="Organizations"
      />
      {renderContent()}
    </div>
  );
};

export default React.memo(OrgsMain);
