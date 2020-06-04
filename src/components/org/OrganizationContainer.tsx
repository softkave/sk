import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/store";
import Board from "../board/Board";
import StyledCenterContainer from "../styled/CenterContainer";

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
  const organization = useSelector<IAppState, IBlock | undefined>((state) =>
    getBlock(state, organizationId)
  );

  if (!organization) {
    return (
      <StyledCenterContainer>
        <Empty description="Organization not found." />
      </StyledCenterContainer>
    );
  }

  return <Board block={organization} />;
};

export default OrganizationContainer;
