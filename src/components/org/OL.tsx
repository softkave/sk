import styled from "@emotion/styled";
import { Button, Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import { addBlockOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import getNewBlock from "../block/getNewBlock";
import StyledCenterContainer from "../styled/CenterContainer";
import StyledContainer from "../styled/Container";
import EditOrgFormWithModal from "./EditOrgFormWithModal";
import OrganizationListItem from "./OLI";

const StyledH1 = StyledContainer.withComponent("h1");

export interface IOrganizationListProps {
  orgs: IBlock[];
  onClick: (org: IBlock) => void;
}

const OrganizationList: React.FC<IOrganizationListProps> = props => {
  const { orgs, onClick } = props;
  const [newOrg, setNewOrg] = React.useState<IBlock | null>(null);
  const user = useSelector(getSignedInUserRequired);

  if (orgs.length === 0) {
    return (
      <StyledEmptyContainer>
        <Empty description="Create an organization to get started." />
      </StyledEmptyContainer>
    );
  }

  const renderOrgForm = () => {
    if (newOrg) {
      return (
        <EditOrgFormWithModal
          visible={!!newOrg}
          onSubmit={async (org, options: IOperationFuncOptions) => {
            await addBlockOperationFunc({ user, block: org as any }, options);
          }}
          onClose={() => setNewOrg(null)}
          customId={newOrg.customId}
          initialValues={newOrg}
          operationID={addBlockOperationID}
          title="Create Organization"
          submitLabel="Create Organization"
        />
      );
    }

    return null;
  };

  return (
    <StyledContainer
      s={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        padding: "0px 16px",
        maxWidth: "400px"
      }}
    >
      {renderOrgForm()}
      <StyledH1 s={{ margin: "16px 0", marginBottom: "32px" }}>
        Organizations
      </StyledH1>
      {/* <StyledContainer
                s={{
                  lineHeight: "16px",
                  padding: "0 24px"
                }}
              >
                <StyledFlatButton style={{ color: "#1890ff" }}>
                  <Icon type="plus-circle" theme="twoTone" />
                  Create Organization
                </StyledFlatButton>
              </StyledContainer> */}
      <StyledContainer s={{ marginBottom: "16px" }}>
        <Button
          block
          onClick={() => setNewOrg(getNewBlock(user, "org"))}
          icon="plus"
        >
          Create Organization
        </Button>
      </StyledContainer>
      <StyledList>
        {orgs.map(org => {
          return (
            <StyledOrgListItem key={org.customId}>
              <OrganizationListItem org={org} onClick={onClick} />
            </StyledOrgListItem>
          );
        })}
      </StyledList>
    </StyledContainer>
  );
};

export default OrganizationList;

const lastOfTypeSelector = "&:last-of-type";
const hoverSelector = "&:hover";
const StyledOrgListItem = styled.div({
  padding: "24px 0px",
  borderBottom: "1px solid #DDD",
  cursor: "pointer",

  [lastOfTypeSelector]: {
    borderBottom: 0
  },

  [hoverSelector]: {
    backgroundColor: "#E6F7FF"
  }
});

const StyledEmptyContainer = styled(StyledCenterContainer)({
  marginTop: 64
});

const StyledList = styled.div({
  overflow: "auto"
});
