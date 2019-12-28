import styled from "@emotion/styled";
import { Drawer, Icon, Menu } from "antd";
import React from "react";
import Media from "react-media";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import { IUser } from "../../models/user/user";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import AssignedTasksMain from "../assigned-tasks/AT";
import Notifications from "../notification/A";
import OrganizationListContainer from "../org/OLC";
import StyledContainer from "../styled/Container";
import theme from "../theme";
import Header from "./Header";

const StyledMenu = StyledContainer.withComponent(Menu);

type DesktopMenuRenderType = "drawer" | "side";

const Layout: React.FC<{}> = props => {
  const history = useHistory();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDesktopMenuOpen, setDesktopMenuOpen] = React.useState(false);

  // TODO: put in local storage or save in user in server
  const [desktopMenuRenderType] = React.useState<DesktopMenuRenderType>(
    "drawer"
  );
  const user = useSelector<IReduxState, IUser>(getSignedInUserRequired);

  const onLogout = () => {
    logoutUserOperationFunc();
  };

  const renderRoutes = () => {
    return (
      <Switch>
        <Route path="/app/notifications" component={Notifications} />
        <Route path="/app/assigned-tasks" component={AssignedTasksMain} />
        <Route
          path="/app/organizations"
          component={OrganizationListContainer}
        />
      </Switch>
    );
  };

  const navigateToPath = (key: string) => {
    const path = `/app/${key}`;
    history.push(path);
  };

  const renderMenu = (onClick: (key: string) => void) => (
    <StyledMenu
      mode="vertical"
      s={{
        borderRight: "none !important",
        flexDirection: "column",
        fontSize: "18px"
      }}
      onClick={event => onClick(event.key)}
    >
      <StyledMenuItem key="notifications" style={{ marginTop: "32px" }}>
        <Icon type="mail" />
        <span>Notifications</span>
      </StyledMenuItem>
      <StyledMenuItem key="assigned-tasks">
        <Icon type="schedule" />
        <span>Assigned Tasks</span>
      </StyledMenuItem>
      <StyledMenuItem key="organizations" style={{ marginBottom: "32px" }}>
        <Icon type="block" />
        <span>Organizations</span>
      </StyledMenuItem>
      <Menu.Divider />
      <StyledMenuItem
        key="logout"
        style={{ color: "rgb(255, 77, 79)", marginTop: "32px" }}
      >
        <Icon type="logout" />
        <span>Logout</span>
      </StyledMenuItem>
    </StyledMenu>
  );

  const renderMenuControls = () => <StyledContainer></StyledContainer>;

  const renderMain = () => (
    <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
      <Header user={user} onLogout={onLogout} />
      <StyledContainer
        s={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}
      >
        {renderMenu(navigateToPath)}
      </StyledContainer>
    </StyledContainer>
  );

  const renderForMobile = () => {
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
    };

    const mobileNavigateToPath = (path: string) => {
      toggleMobileMenu();
      navigateToPath(path);
    };

    return (
      <StyledContainer
        s={{ flexDirection: "column", width: "100%", height: "100%" }}
      >
        <Header
          user={user}
          onLogout={onLogout}
          onToggleMenu={toggleMobileMenu}
        />
        <Drawer
          visible={isMobileMenuOpen}
          onClose={toggleMobileMenu}
          title="Softkave"
          placement="left"
        >
          {renderMenu(mobileNavigateToPath)}
        </Drawer>
        <StyledContainer s={{ width: "100%", flex: 1 }}>
          {renderRoutes()}
        </StyledContainer>
      </StyledContainer>
    );
  };

  const renderForDesktop = () => {
    const toggleDesktopMenu = () => {
      setDesktopMenuOpen(!isDesktopMenuOpen);
    };

    const desktopNavigateToPath = (path: string) => {
      if (desktopMenuRenderType === "drawer") {
        toggleDesktopMenu();
      }

      navigateToPath(path);
    };

    const renderMenuContentForDesktop = () => (
      <React.Fragment>
        {renderMenuControls()}
        {renderMenu(desktopNavigateToPath)}
      </React.Fragment>
    );

    const renderMenuTypeDrawer = () => (
      <Drawer
        visible={isDesktopMenuOpen}
        title="Softkave"
        placement="left"
        onClose={toggleDesktopMenu}
      >
        {renderMenuContentForDesktop()}
      </Drawer>
    );

    const renderMenuTypeSide = () =>
      isDesktopMenuOpen && (
        <StyledContainer>{renderMenuContentForDesktop()}</StyledContainer>
      );

    const renderMenuDesktop = () =>
      desktopMenuRenderType === "side"
        ? renderMenuTypeSide()
        : renderMenuTypeDrawer();

    return (
      <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
        <Header
          user={user}
          onLogout={onLogout}
          onToggleMenu={toggleDesktopMenu}
        />
        <StyledContainer s={{ flex: 1, overflow: "hidden" }}>
          {renderMenuDesktop()}
          <StyledContainer s={{ width: "100%" }}>
            {renderRoutes()}
          </StyledContainer>
        </StyledContainer>
      </StyledContainer>
    );
  };

  const render = () => {
    return (
      <Media queries={{ mobile: `(max-width: ${theme.breakpoints.sm}px)` }}>
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

const StyledMenuItem = styled(Menu.Item)({
  fontSize: "16px !important"
});
