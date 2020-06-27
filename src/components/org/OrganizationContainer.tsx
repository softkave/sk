import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/types";
import Board from "../board/Board";
import StyledContainer from "../styled/Container";

interface IRouteMatchParams {
  organizationId?: string;
}

const OrganizationContainer: React.FC<{}> = () => {
  const organizationPath = "/app/organizations/:organizationId";
  const selectedOrganizationRouteMatch = useRouteMatch<IRouteMatchParams>(
    organizationPath
  );
  const organizationId =
    selectedOrganizationRouteMatch &&
    selectedOrganizationRouteMatch.params.organizationId;
  const organization = useSelector<IAppState, IBlock | undefined>((state) => {
    if (organizationId) {
      return BlockSelectors.getBlock(state, organizationId);
    }
  });

  if (!organization) {
    return (
      <StyledContainer s={{ alignItems: "center", justifyContent: "center" }}>
        <Empty description="Organization not found." />
      </StyledContainer>
    );
  }

  return <Board block={organization} />;
};

export default OrganizationContainer;
