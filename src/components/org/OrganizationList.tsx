import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockGrid from "../block/BlockGrid";
import BlockList from "../block/BlockList";
import BoardBlockTypeHeader from "../board/BoardBlockTypeHeader";
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
        }}
      >
        {/* <StyledContainer s={{ marginBottom: "16px" }}>
          <BoardBlockTypeHeader title="organizations" count={orgs.length} />
        </StyledContainer> */}
        <StyledContainer s={{ marginBottom: "24px" }}>
          <Button type="primary" onClick={() => setShowOrgForm(true)}>
            <PlusOutlined />
            New Organization
          </Button>
        </StyledContainer>
        <BlockList
          blocks={orgs}
          emptyDescription="Create an organization to get started."
          onClick={onClick}
          showFields={["name", "description"]}
        />
        {/* <Row>
          <Col xs={24} sm={{ span: 12, offset: 6 }} md={{ span: 8, offset: 8 }}>
            <StyledContainer s={{ marginBottom: "16px" }}>
              <BoardBlockTypeHeader title="organizations" count={orgs.length} />
            </StyledContainer>
            <StyledContainer s={{ marginBottom: "8px" }}>
              <Button onClick={() => setShowOrgForm(true)}>
                New Organization
              </Button>
            </StyledContainer>
            <BlockList
              blocks={orgs}
              emptyDescription="Create an organization to get started."
              onClick={onClick}
              showFields={["name", "description"]}
            />
          </Col>
        </Row> */}
      </StyledContainer>
    </StyledContainer>
  );
};

export default OrganizationList;
