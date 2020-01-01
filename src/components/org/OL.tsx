import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import { addBlockOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import BlockList from "../block/BlockList";
import getNewBlock from "../block/getNewBlock";
import BoardBlockTypeHeader from "../board/BoardBlockTypeHeader";
import StyledContainer from "../styled/Container";
import EditOrgFormWithModal from "./EditOrgFormWithModal";

export interface IOrganizationListProps {
  orgs: IBlock[];
  onClick: (org: IBlock) => void;
}

const OrganizationList: React.FC<IOrganizationListProps> = props => {
  const { orgs, onClick } = props;
  const [newOrg, setNewOrg] = React.useState<IBlock | null>(null);
  const user = useSelector(getSignedInUserRequired);
  const history = useHistory();

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
        padding: "0px 24px",
        maxWidth: "400px"
      }}
    >
      {renderOrgForm()}
      <BoardBlockTypeHeader
        blockType="org"
        onClickCreate={() => setNewOrg(getNewBlock(user, "org"))}
        onNavigateBack={() => history.push("/app")}
      />
      <BlockList
        blocks={orgs}
        emptyDescription="Create an organization to get started."
        onClick={onClick}
        showFields={["name", "description"]}
      />
    </StyledContainer>
  );
};

export default OrganizationList;
