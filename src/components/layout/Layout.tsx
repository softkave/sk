import { Drawer } from "antd";
import React from "react";
import Media from "react-media";
import { useStore } from "react-redux";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getWindowWidth } from "../../utils/window";
import AssignedTasksMain from "../assigned-tasks/AssignedTasksMain";
import NotificationsMain from "../notification/NotificationsMain";
import OrganizationsMain from "../organizations/Organizations";
import StyledFlexFillContainer from "../styled/FillContainer";
import theme from "../theme";
import Header from "./Header";
import NavigationMenuList, {
  getBaseNavPath,
  getCurrentBaseNavPath
} from "./NavigationMenuList";

const isCurrentWindowMobile = () => {
  const windowWidth = getWindowWidth();

  if (windowWidth <= theme.breakpoints.md) {
    return true;
  }

  return false;
};

const Layout: React.SFC<{}> = props => {
  const store = useStore<IReduxState>();
  const history = useHistory();
  const [menuCollapsed, setMenuCollapsed] = React.useState(
    isCurrentWindowMobile()
  );
  const state = store.getState();
  const user = getSignedInUserRequired(state);
  const currentBaseNav = getCurrentBaseNavPath();

  const onLogout = () => {
    logoutUserOperationFunc(state, store.dispatch);
  };

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const navigateToPath = (path: string) => {
    toggleMenu();
    history.push(getBaseNavPath(path));
  };

  const renderNavMenu = () => {
    return (
      <NavigationMenuList
        currentItemKey={currentBaseNav}
        onClick={navigateToPath}
      />
    );
  };

  const renderMenuForMobile = () => {
    return (
      <Drawer visible={!menuCollapsed} onClose={toggleMenu}>
        {renderNavMenu()}
      </Drawer>
    );
  };

  const renderMenuForDesktop = () => {
    return <div>{renderNavMenu()}</div>;
  };

  const renderMenu = () => {
    return (
      <Media queries={{ mobile: `(min-width: ${theme.breakpoints.md})` }}>
        {matches => (
          <React.Fragment>
            {matches.mobile && renderMenuForMobile()}
            {!matches.mobile && renderMenuForDesktop()}
          </React.Fragment>
        )}
      </Media>
    );
  };

  const renderBody = () => {
    return (
      <Switch>
        <Route path="/notifications" component={NotificationsMain} />
        <Route path="/assigned-tasks" component={AssignedTasksMain} />
        <Route path="/organizations" component={OrganizationsMain} />
      </Switch>
    );
  };

  return (
    <div>
      <Header user={user} onLogout={onLogout} onToggleMenu={toggleMenu} />
      <StyledFlexFillContainer>
        {renderMenu()}
        <StyledFlexFillContainer>{renderBody()}</StyledFlexFillContainer>
      </StyledFlexFillContainer>
    </div>
  );
};

export default Layout;
