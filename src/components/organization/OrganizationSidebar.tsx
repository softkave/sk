/*eslint no-useless-computed-key: "off"*/

import { Tabs, Typography } from "antd";
import React from "react";
import { Redirect, useHistory, useRouteMatch } from "react-router";
import { RightOutlined } from "@ant-design/icons";
import OrganizationHeader from "./OrganizationHeader";
import { css, cx } from "@emotion/css";
import OrganizationSidebarTabText from "./OrganizationSidebarTabText";
import { SystemResourceType } from "../../models/app/types";
import OrganizationSidebarBoards from "./OrganizationSidebarBoards";
import OrganizationSidebarChat from "./OrganizationSidebarChat";
import OrganizationSidebarRequests from "./OrganizationSidebarRequests";
import OrganizationSidebarCollaborators from "./OrganizationSidebarCollaborators";
import OrganizationFormDrawer from "./OrganizationFormDrawer";
import useOrganizationFromPath from "./useOrganizationFromPath";
import { useSelector } from "react-redux";
import KeyValueSelectors from "../../redux/key-value/selectors";
import {
  IUnseenChatsCountByOrg,
  KeyValueKeys,
} from "../../redux/key-value/types";
import { IAppState } from "../../redux/types";
import {
  appLoggedInPaths,
  appOrganizationPaths,
} from "../../models/app/routes";
import {
  organizationResourceTypeToSystemResourceType,
  systemResourceTypeToOrganizationResourceType,
} from "./utils";
import cast from "../../utils/cast";

export interface IOrganizationSidebarProps {
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

const OrganizationSidebar: React.FC<IOrganizationSidebarProps> = (props) => {
  const { isMobile, hideHeader } = props;
  const history = useHistory();
  const { organization } = useOrganizationFromPath();
  const [organizationForm, setOrganizationForm] = React.useState(false);
  const unseenChatsCountMapByOrg = useSelector<
    IAppState,
    IUnseenChatsCountByOrg
  >((state) =>
    KeyValueSelectors.getKey(state, KeyValueKeys.UnseenChatsCountByOrg)
  );

  const closeOrganizationForm = React.useCallback(() => {
    // TODO: prompt the user if the user has unsaved changes
    setOrganizationForm(false);
  }, []);

  const openOrganizationForm = React.useCallback(() => {
    setOrganizationForm(true);
  }, []);

  const organizationPath =
    organization && appOrganizationPaths.organization(organization.customId);
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

  const unseenChatsCount = unseenChatsCountMapByOrg[organization.customId] || 0;
  const tabsNode = (
    <Tabs
      activeKey={organizationResourceTypeToSystemResourceType(
        resourceType as any
      )}
      onChange={onSelectResourceType}
      moreIcon={
        <Typography.Text type="secondary">
          <RightOutlined />
        </Typography.Text>
      }
      tabBarExtraContent={{
        left: <div style={{ marginLeft: "16px" }} />,
      }}
    >
      <Tabs.TabPane
        tab={<OrganizationSidebarTabText text="Boards" />}
        key={SystemResourceType.Board}
      >
        <OrganizationSidebarBoards organization={organization} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <OrganizationSidebarTabText
            text="Chat"
            unseenChatsCount={unseenChatsCount}
          />
        }
        key={SystemResourceType.Chat}
      >
        <OrganizationSidebarChat organization={organization} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<OrganizationSidebarTabText text="Requests" />}
        key={SystemResourceType.CollaborationRequest}
      >
        <OrganizationSidebarRequests organization={organization} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<OrganizationSidebarTabText text="Collaborators" />}
        key={SystemResourceType.Collaborator}
      >
        <OrganizationSidebarCollaborators organization={organization} />
      </Tabs.TabPane>
    </Tabs>
  );

  const organizationFormNode = organizationForm && (
    <OrganizationFormDrawer
      visible
      organization={organization}
      onClose={closeOrganizationForm}
    />
  );

  const headerNode = !hideHeader && (
    <OrganizationHeader
      organization={organization}
      isMobile={isMobile}
      onClickEditBlock={openOrganizationForm}
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
      {tabsNode}
    </div>
  );
};

export default React.memo(OrganizationSidebar);
