import { Typography } from "antd";
import React from "react";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeMobileProps {
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const AppHomeMobile: React.FC<IAppHomeMobileProps> = (props) => {
  return <Typography.Paragraph>Not implemented yet!</Typography.Paragraph>;
  // const { onSelect } = props;
  // const user = useSelector(SessionSelectors.assertGetUser);
  // const renderNotification = () => <Notification />;
  // const renderSettings = () => <UserSettings />;
  // return (
  //   <div style={{ flexDirection: "column", height: "100%" }}>
  //     <HeaderMobile user={user} onSelect={onSelect} />
  //     <div style={{ flex: 1, overflow: "hidden" }}>
  //       <Switch>
  //         <Route
  //           path={appRequestsPaths.requestSelector}
  //           render={renderNotification}
  //         />
  //         <Route
  //           exact
  //           path={appLoggedInPaths.organizations}
  //           component={OrganizationListContainer}
  //         />
  //         <Route
  //           path={appOrganizationPaths.organizationSelector}
  //           render={() => {
  //             return null;
  //           }}
  //         />
  //         <Route
  //           exact
  //           path={appLoggedInPaths.settings}
  //           render={renderSettings}
  //         />
  //         <Route
  //           exact
  //           path="*"
  //           render={() => <Redirect to={appLoggedInPaths.organizations} />}
  //         />
  //       </Switch>
  //     </div>
  //   </div>
  // );
};

export default AppHomeMobile;
