import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import OrgBoardContainer from "../board/OrgBoardContainer";
import Notifications from "../notification/Notifications";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import StyledContainer from "../styled/Container";
import LayoutMenuDesktop from "./LayoutMenuDesktop";

export interface IMainDesktopProps {
  showAppMenu: boolean;
  showOrgForm: boolean;
  rootBlocksLoaded: boolean;
  toggleMenu: () => void;
  closeNewOrgForm: () => void;
  onSelectNotifications: () => void;
}

const MainDesktop: React.FC<IMainDesktopProps> = (props) => {
  const {
    showAppMenu,
    showOrgForm,
    closeNewOrgForm,
    rootBlocksLoaded,
    onSelectNotifications,
  } = props;

  return (
    <StyledContainer s={{ height: "100%", overflow: "hidden" }}>
      {showAppMenu && (
        <LayoutMenuDesktop onSelectNotifications={onSelectNotifications} />
      )}
      {showOrgForm && <EditOrgFormInDrawer visible onClose={closeNewOrgForm} />}
      <Switch>
        <Route path="/app/notifications" render={() => <Notifications />} />
        <Route
          path="/app/organizations/*"
          render={() => {
            if (rootBlocksLoaded) {
              return <OrgBoardContainer />;
            }

            return null;
          }}
        />
        <Route
          exact
          path="*"
          render={() => <Redirect to="/app/organizations" />}
        />
      </Switch>
    </StyledContainer>
  );
};

export default MainDesktop;
