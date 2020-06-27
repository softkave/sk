import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockGrid from "../block/BlockGrid";
import BlockList from "../block/BlockList";
import BlockThumbnail from "../block/BlockThumnail";
import EmptyMessage from "../EmptyMessage";
import RenderForDevice from "../RenderForDevice";
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
        />
      );
    }

    return null;
  };

  // TODO: add an empty container

  const renderOrgs = () => (
    <RenderForDevice
      renderForMobile={() => (
        <BlockList
          blocks={orgs}
          emptyDescription="Create an organization to get started."
          onClick={onClick}
          showFields={["name", "description"]}
        />
      )}
      renderForDesktop={() => (
        <StyledContainer s={{ marginTop: "16px" }}>
          <BlockGrid
            blocks={orgs}
            emptyDescription="Create an organization to get started."
            onClick={onClick}
            showFields={["name", "description"]}
          />
        </StyledContainer>
      )}
    />
  );

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
          margin: "0 auto",
          flex: 1,
          // maxWidth: "600px",
        }}
      >
        <StyledContainer s={{ marginBottom: "24px", padding: "0 16px" }}>
          <StyledContainer s={{ flex: 1, justifyContent: "flex-end" }}>
            <Button onClick={() => setShowOrgForm(true)}>
              <PlusOutlined />
              New Org
            </Button>
          </StyledContainer>
        </StyledContainer>
        {/* {renderOrgs()} */}
        <StyledContainer
          s={{
            width: "100%",
            flexDirection: "column",
            margin: "0 auto",
            flex: 1,
          }}
        >
          {orgs.length === 0 && (
            <EmptyMessage>Create an org to get started</EmptyMessage>
          )}
          {orgs.map((org, i) => (
            <StyledContainer
              s={{
                padding: "16px",
                borderTop: i === 0 ? undefined : "1px solid #d9d9d9",
              }}
            >
              <BlockThumbnail
                block={org}
                showFields={["name", "description"]}
                style={{ maxWidth: "550px", margin: "auto" }}
                onClick={() => onClick(org)}
              />
            </StyledContainer>
          ))}
          {/* <BlockList
            border
            blocks={orgs}
            emptyDescription="Create an organization to get started."
            onClick={onClick}
            showFields={["name", "description"]}
          /> */}
        </StyledContainer>
      </StyledContainer>
    </StyledContainer>
  );
};

export default OrganizationList;
