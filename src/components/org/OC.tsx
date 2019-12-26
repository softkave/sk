import { Empty } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import { popView, setCurrentProject } from "../../redux/view/actions";
import BoardContainer from "../board/BoardContainer";
// import BA from "../board/BA";
import StyledCenterContainer from "../styled/CenterContainer";

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
  const dispatch = useDispatch();

  if (!organization) {
    return (
      <StyledCenterContainer>
        <Empty description="Organization not found." />
      </StyledCenterContainer>
    );
  }

  return (
    <BoardContainer
      blockID={organization.customId}
      block={organization}
      isFromRoot={false}
      isUserRootBlock={false}
      onSelectProject={(project: IBlock) => {
        dispatch(setCurrentProject(project));
      }}
      onBack={() => dispatch(popView())}
    />
  );
  // return <BA block={organization} />;
};

export default OrganizationContainer;
