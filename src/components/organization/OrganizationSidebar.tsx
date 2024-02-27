/*eslint no-useless-computed-key: "off"*/

import { css, cx } from "@emotion/css";
import React from "react";
import { Redirect, Route, Switch, useHistory, useRouteMatch } from "react-router";
import { appLoggedInPaths, appOrganizationPaths } from "../../models/app/routes";
import { SystemResourceType } from "../../models/app/types";
import cast from "../../utils/cast";
import AppTabs, { IAppTabItem } from "../utils/page/AppTabs";
import OrganizationForm from "./OrganizationForm";
import OrganizationHeader from "./OrganizationHeader";
import OrganizationSidebarBoards from "./OrganizationSidebarBoards";
import OrganizationSidebarChat from "./OrganizationSidebarChat";
import OrganizationSidebarCollaborators from "./OrganizationSidebarCollaborators";
import OrganizationSidebarRequests from "./OrganizationSidebarRequests";
import { useOrganizationIdFromPathRequired } from "./useOrganizationIdFromPath";
import useOrganizationReady from "./useOrganizationReady";
import {
  organizationResourceTypeToSystemResourceType,
  systemResourceTypeToOrganizationResourceType,
} from "./utils";

export interface IWorkspaceSidebarProps {
  isMobile: boolean;
  hideHeader?: boolean;
}

const classes = {
  selectedOrgViewRoot: css({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto 1fr",
    height: "100%",
    overflow: "hidden",
    flexDirection: "column",
    borderRight: "2px solid rgb(223, 234, 240)",

    "& .ant-tabs": {
      height: "100%",
    },

    "& .ant-tabs-content": {
      height: "100%",
    },

    "& .ant-tabs-top > .ant-tabs-nav::before": {
      borderBottom: "2px solid rgb(223, 234, 240) !important",
    },
  }),
  selectedOrgViewRootMobile: css({
    maxWidth: "100%",

    ["& .ant-tabs"]: {
      width: "100%",
    },
  }),
  selectedOrgViewRootDesktop: css({
    minWidth: "320px",
    maxWidth: "320px",

    ["& .ant-tabs"]: {
      width: "320px",
    },

    ["& .ant-tabs-tab"]: {
      padding: "8px 0px !important",
    },
  }),
  selectOrgView: css({
    boxSizing: "border-box",
  }),
  selectOrgViewMobile: css({
    width: "100%",
    padding: "16px !important",
  }),
  selectOrgViewDesktop: css({
    boxSizing: "border-box",
    padding: "8px 16px !important",
  }),
};

const OrganizationSidebar: React.FC<IWorkspaceSidebarProps> = (props) => {
  const { isMobile, hideHeader } = props;
  const history = useHistory();
  const { organizationId } = useOrganizationIdFromPathRequired();
  const { organization } = useOrganizationReady();
  const [organizationForm, setOrganizationForm] = React.useState(false);
  const closeOrganizationForm = React.useCallback(() => {
    // TODO: prompt the user if the user has unsaved changes
    setOrganizationForm(false);
  }, []);

  const openOrganizationForm = React.useCallback(() => {
    setOrganizationForm(true);
  }, []);

  const organizationPath = organization && appOrganizationPaths.organization(organization.customId);
  const resourceTypeMatch = useRouteMatch<{ resourceType: string }>(
    `${organizationPath}/:resourceType`
  );
  const resourceType = resourceTypeMatch?.params.resourceType;

  const onSelectResourceType = React.useCallback(
    (key: string) => {
      const systemResourceType = systemResourceTypeToOrganizationResourceType(
        cast<SystemResourceType>(key)
      );
      const nextPath = `${organizationPath}/${systemResourceType}`;
      history.push(nextPath);
    },
    [organizationPath, history]
  );

  if (!organization) {
    return <Redirect to={appLoggedInPaths.organizations} />;
  } else if (!resourceType) {
    const defaultPath = appOrganizationPaths.boards(organization.customId);
    return <Redirect to={defaultPath} />;
  }

  // TODO: auth checks
  const canReadBoards = true;
  const canReadChats = true;
  const canReadRequests = true;
  const canReadCollaborators = true;
  const canAssignPermission = true;
  const tabItems: Array<IAppTabItem> = [];

  if (canReadBoards) {
    tabItems.push({
      label: "Boards",
      key: SystemResourceType.Board,
      children: <OrganizationSidebarBoards organization={organization} />,
    });
  }
  if (canReadChats) {
    tabItems.push({
      label: "Chat",
      key: SystemResourceType.Chat,
      children: <OrganizationSidebarChat organization={organization} />,
      badgeCount: organization.unseenChatsCount,
    });
  }
  if (canReadCollaborators) {
    tabItems.push({
      label: "Collaborators",
      key: SystemResourceType.User,
      children: <OrganizationSidebarCollaborators organization={organization} />,
    });
  }
  if (canReadRequests) {
    tabItems.push({
      label: "Collaboration Requests",
      key: SystemResourceType.CollaborationRequest,
      children: <OrganizationSidebarRequests organization={organization} />,
    });
  }

  const organizationFormNode = organizationForm && (
    <OrganizationForm org={organization} onClose={closeOrganizationForm} />
  );

  const headerNode = !hideHeader && (
    <OrganizationHeader
      organization={organization}
      isMobile={isMobile}
      onClickEditBlock={openOrganizationForm}
      onSelectOpenAccessControlScreen={() =>
        history.push(appOrganizationPaths.permissions(organizationId))
      }
      className={cx(classes.selectOrgView, {
        [classes.selectOrgViewMobile]: isMobile,
        [classes.selectOrgViewDesktop]: !isMobile,
      })}
    />
  );

  return (
    <div
      className={cx(classes.selectedOrgViewRoot, {
        [classes.selectedOrgViewRootMobile]: isMobile,
        [classes.selectedOrgViewRootDesktop]: !isMobile,
      })}
    >
      {organizationFormNode}
      {headerNode}
      <AppTabs
        activeKey={organizationResourceTypeToSystemResourceType(resourceType as any)}
        onChange={onSelectResourceType}
        items={tabItems}
      />
      <Switch>
        {canAssignPermission && (
          <Route path={appOrganizationPaths.permissions(organizationId)}>
            {/** TODO */}
            {null}
          </Route>
        )}
      </Switch>
    </div>
  );
};

export default React.memo(OrganizationSidebar);
