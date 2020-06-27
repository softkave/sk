import { noop } from "lodash";
import React from "react";
import OrgContainer from "../org/OrgContainer";
import OrgModal from "../org/OrgModal";
import StyledContainer from "../styled/Container";
import LayoutMenu from "./LayoutMenu";

export interface IMainLayoutProps {
  showAppMenu: boolean;
  showOrgForm: boolean;
  toggleMenu: () => void;
  closeNewOrgForm: () => void;
}

const MainLayout: React.FC<IMainLayoutProps> = (props) => {
  const { showAppMenu, showOrgForm, toggleMenu, closeNewOrgForm } = props;

  return (
    <StyledContainer s={{ height: "100%" }}>
      {showAppMenu && <LayoutMenu onToggleMenu={toggleMenu} />}
      <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
        {/* {showOrgForm && <OrgContainer onClose={noop} />} */}
        {showOrgForm && <OrgModal onClose={closeNewOrgForm} />}
        {/* <Switch>
            <Route path="/app/notifications" component={Notifications} />
            <Route
              path="/app/organizations"
              component={OrganizationListContainer}
            />
            <Route exact path="/app" component={HomeMenu} />
            <Route
              exact
              path="*"
              render={() => <Redirect to="/app/organizations" />}
            />
          </Switch> */}
      </StyledContainer>
    </StyledContainer>
  );
};

export default MainLayout;
