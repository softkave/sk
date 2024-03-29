import { css, cx } from "@emotion/css";
import { Button, Typography } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useHistory } from "react-router";
import { appLoggedInPaths } from "../../models/app/routes";
import { IAppWorkspace } from "../../models/organization/types";
import OrganizationHeaderOptionsMenu, {
  OrgHeaderSettingsMenuKey,
} from "./OrganizationHeaderOptionsMenu";

export interface IWorkspaceHeaderProps {
  organization: IAppWorkspace;
  isMobile: boolean;
  onClickEditBlock: () => void;
  onSelectOpenAccessControlScreen: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const classes = {
  prefixBtnContainer: css({
    "& .anticon": {
      verticalAlign: "middle",
    },
  }),
  prefixBtnContainerMobile: css({ marginRight: "16px" }),
  root: css({
    display: "grid",
    gridTemplateColumns: "1fr auto",
    columnGap: 16,
    borderBottom: "2px solid rgb(223, 234, 240)",
    maxWidth: "100%",
  }),
  rootMobile: css({
    gridTemplateColumns: "auto 1fr auto",
  }),
  menuContainer: css({ alignItems: "center" }),
};

const OrganizationHeader: React.FC<IWorkspaceHeaderProps> = (props) => {
  const {
    organization,
    isMobile,
    style,
    className,
    onClickEditBlock,
    onSelectOpenAccessControlScreen,
  } = props;
  const history = useHistory();
  const onSelectSettingsMenuItem = React.useCallback(
    (key: OrgHeaderSettingsMenuKey) => {
      switch (key) {
        case OrgHeaderSettingsMenuKey.EDIT:
          onClickEditBlock();
          break;
        case OrgHeaderSettingsMenuKey.AssignPermission:
          onSelectOpenAccessControlScreen();
          break;
      }
    },
    [onClickEditBlock, onSelectOpenAccessControlScreen]
  );

  const onBack = React.useCallback(() => {
    history.push(appLoggedInPaths.organizations);
  }, [history]);

  const renderHeaderPrefixButton = () => {
    if (isMobile) {
      return (
        <div className={cx(classes.prefixBtnContainerMobile, classes.prefixBtnContainer)}>
          <Button style={{ cursor: "pointer" }} onClick={onBack} className="icon-btn">
            <ArrowLeft />
          </Button>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div
      className={cx(className, classes.root, {
        [classes.rootMobile]: isMobile,
      })}
      style={style}
    >
      {renderHeaderPrefixButton()}
      <Typography.Title
        ellipsis={{ rows: 2 }}
        level={5}
        style={{
          marginBottom: 0,
          textTransform: "capitalize",
        }}
      >
        {organization.name}
      </Typography.Title>
      <div className={classes.menuContainer}>
        <OrganizationHeaderOptionsMenu
          organization={organization}
          onSelect={onSelectSettingsMenuItem}
        />
      </div>
    </div>
  );
};

export default React.memo(OrganizationHeader);
