import React from "react";
import { IBlock } from "../../models/block/block";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { IAppOrganization } from "../../models/organization/types";
import { IUnseenChatsCountByOrg } from "../../redux/key-value/types";
import GeneralError from "../Message";
import StyledContainer from "../styled/Container";
import Scrollbar from "../utilities/Scrollbar";
import OrgsList from "./OrgsList";
import OrgsListHeader from "./OrgsListHeader";

export interface IOrgsMainProps {
  orgs: IAppOrganization[];
  requests: ICollaborationRequest[];
  unseenChatsCountMapByOrg: IUnseenChatsCountByOrg;
  onAddOrg: () => void;
  onSelectOrg: (org: IBlock) => void;
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
    <StyledContainer
      s={{
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Scrollbar>
        <OrgsListHeader
          onClickCreate={onAddOrg}
          onSearchTextChange={setSearchQuery}
          style={{ paddingBottom: "8px", paddingTop: "8px" }}
          placeholder="Search orgs and requests..."
          title="Organizations"
        />
        {renderContent()}
      </Scrollbar>
    </StyledContainer>
  );
};

export default React.memo(OrgsMain);
