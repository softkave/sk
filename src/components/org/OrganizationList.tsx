import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";
import BoardBlockTypeHeader from "../board/BoardBlockTypeHeader";
import StyledContainer from "../styled/Container";
import EditOrgFormWithDrawer from "./EditOrgFormInDrawer";

export interface IOrganizationListProps {
  orgs: IBlock[];
  onClick: (org: IBlock) => void;
}

const OrganizationList: React.FC<IOrganizationListProps> = (props) => {
  const { orgs, onClick } = props;
  const [showOrgForm, setShowOrgForm] = React.useState(false);

  const renderOrgForm = () => {
    if (showOrgForm) {
      return (
        <EditOrgFormWithDrawer
          visible={!!showOrgForm}
          onClose={() => setShowOrgForm(false)}
          title="Create Organization"
          submitLabel="Create Organization"
        />
      );
    }

    return null;
  };

  // TODO: add an empty container

  return (
    <StyledContainer
      s={{
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      {renderOrgForm()}
      <StyledContainer
        s={{
          width: "100%",
          flexDirection: "column",
          maxWidth: "400px",
          margin: "0 auto",
          flex: 1,
        }}
      >
        <StyledContainer s={{ marginBottom: "16px" }}>
          <BoardBlockTypeHeader
            title="organizations"
            count={orgs.length}
            onClickCreate={() => setShowOrgForm(true)}
          />
        </StyledContainer>
        <BlockList
          showExploreMenu
          blocks={orgs}
          emptyDescription="Create an organization to get started."
          onClick={onClick}
          showFields={["name", "description"]}
          onClickChildMenuItem={() => null}
        />
      </StyledContainer>
    </StyledContainer>
  );
};

export default OrganizationList;
