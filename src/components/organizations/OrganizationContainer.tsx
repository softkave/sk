import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import BA from "../board/BA";
import StyledCenterContainer from "../styled/CenterContainer";
// import Organization from "./Organization";

interface IRouteMatchParams {
  organizationID?: string;
}

const OrganizationContainer: React.FC<{}> = props => {
  const organizationPath = "/app/organizations/:organizationID";
  const selectedOrganizationRouteMatch = useRouteMatch<IRouteMatchParams>(
    organizationPath
  );
  const organizationID =
    selectedOrganizationRouteMatch &&
    selectedOrganizationRouteMatch.params.organizationID;
  const organization = useSelector<IReduxState, IBlock | undefined>(state =>
    getBlock(state, organizationID)
  );

  if (!organization) {
    return (
      <StyledCenterContainer>
        <Empty description="Organization not found." />
      </StyledCenterContainer>
    );
  }

  return <BA block={organization} />;
};

export default OrganizationContainer;
