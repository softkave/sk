import { Drawer, Icon, Menu } from "antd";
import React from "react";
import Media from "react-media";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import { IUser } from "../../models/user/user";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
// import AssignedTasksMain from "../assigned-tasks/AssignedTasksMain";
// import NotificationsMain from "../notifications/NotificationsMain";
// import OrganizationsMain from "../organizations/OrganizationsMain";
// import StyledFlexColumnContainer from "../styled/ColumnContainer";
import StyledContainer from "../styled/Container";
// import StyledFlexFillContainer from "../styled/FillContainer";
import theme from "../theme";
import Header from "./Header";
// import NavigationMenuList from "./NavigationMenuList";
import { getCurrentBaseNavPath } from "./path";

const StyledMenu = StyledContainer.withComponent(Menu);

type DesktopMenuRenderType = "drawer" | "side";

const Layout: React.FC<{}> = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDesktopMenuOpen, setDesktopMenuOpen] = React.useState(true);

  // TODO: put in local storage or save in user in server
  const [desktopMenuRenderType, setDesktopMenuRenderType] = React.useState<
    DesktopMenuRenderType
  >("drawer");
  const user = useSelector<IReduxState, IUser>(getSignedInUserRequired);
  const currentBaseNav = getCurrentBaseNavPath();

  const onLogout = () => {
    dispatch(logoutUserOperationFunc());
  };

  // const renderBody = () => {
  //   return (
  //     <Switch>
  //       <Route path="/app/notifications" component={NotificationsMain} />
  //       <Route path="/app/assigned-tasks" component={AssignedTasksMain} />
  //       <Route path="/app/organizations" component={OrganizationsMain} />
  //     </Switch>
  //   );
  // };

  const renderMenu = () => (
    <StyledMenu s={{ borderRight: "none !important" }}>
      <Menu.Item key="notifications">
        <Icon type="mail" />
        <span>Notifications</span>
      </Menu.Item>
      <Menu.Item key="assigned-tasks">
        <Icon type="schedule" />
        <span>Assigned Tasks</span>
      </Menu.Item>
      <Menu.Item key="organizations">
        <Icon type="block" />
        <span>Organizations</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="power" />
        <span>Logout</span>
      </Menu.Item>
    </StyledMenu>
  );

  const renderMenuControls = () => <StyledContainer></StyledContainer>;

  const renderMenuWithControlsInDrawer = () => (
    <Drawer visible>
      {renderMenuControls()}
      {renderMenu()}
    </Drawer>
  );

  const renderMain = () => (
    <StyledContainer
      s={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Header user={user} onLogout={onLogout} />
      {renderMenu()}
    </StyledContainer>
  );

  const renderForMobile = () => {
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigateToPath = (path: string) => {
      toggleMobileMenu();
      history.push(`/app/${path}`);
    };

    return (
      <StyledContainer s={{ flexDirection: "column" }}>
        <Header
          user={user}
          onLogout={onLogout}
          onToggleMenu={toggleMobileMenu}
        />
        <Drawer visible={isMobileMenuOpen} onClose={toggleMobileMenu}>
          {renderMenu()}
        </Drawer>
      </StyledContainer>
    );
  };

  const renderForDesktop = () => {
    const toggleDesktopMenu = () => {
      setDesktopMenuOpen(!isDesktopMenuOpen);
    };

    const navigateToPath = (path: string) => {
      history.push(`/app/${path}`);
    };

    const renderMenuContentForDesktop = () => (
      <React.Fragment>
        {renderMenuControls()}
        {renderMenu()}
      </React.Fragment>
    );

    const renderMenuTypeDrawer = () => (
      <Drawer visible>{renderMenuContentForDesktop()}</Drawer>
    );

    const renderMenuTypeSide = () => (
      <StyledContainer>{renderMenuContentForDesktop()}</StyledContainer>
    );

    const renderMenuDesktop = () =>
      desktopMenuRenderType === "side"
        ? renderMenuTypeSide()
        : renderMenuTypeDrawer();

    return (
      <StyledContainer>
        <Header
          user={user}
          onLogout={onLogout}
          onToggleMenu={toggleDesktopMenu}
        />
        <StyledContainer>
          {isDesktopMenuOpen && renderMenuDesktop()}
          <StyledContainer></StyledContainer>
        </StyledContainer>
      </StyledContainer>
    );
  };

  const render = () => {
    return (
      <Media queries={{ mobile: `(min-width: ${theme.breakpoints.md})` }}>
        {matches => (
          <React.Fragment>
            {matches.mobile && renderForMobile()}
            {!matches.mobile && renderForDesktop()}
          </React.Fragment>
        )}
      </Media>
    );
  };

  return (
    <Switch>
      <Route path="/app/*" render={render} />
      <Route exact path="/app" render={renderMain} />
    </Switch>
  );
};

export default Layout;
