import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import { css, cx } from "@emotion/css";
import { Button, Typography } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useHistory } from "react-router";
import { appLoggedInPaths } from "../../models/app/routes";
import { IAppOrganization } from "../../models/organization/types";
import OrgHeaderOptionsMenu, {
  OrgHeaderSettingsMenuKey,
} from "./OrgHeaderOptionsMenu";

export interface IOrgBoardHeaderProps {
  organization: IAppOrganization;
  isMobile: boolean;
  isAppMenuFolded: boolean;
  onClickEditBlock: () => void;
  onToggleFoldAppMenu: () => void;
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
  prefixBtnContainerDesktop: css({ marginRight: "16px", cursor: "pointer" }),
  header: css({
    display: "flex",
    flex: 1,
    alignItems: "center",
    borderBottom: "1px solid rgb(223, 234, 240)",
    height: "56px",
    maxWidth: "100%",
  }),
  menuContainer: css({ alignItems: "center" }),
};

const OrgBoardHeader: React.FC<IOrgBoardHeaderProps> = (props) => {
  const {
    organization,
    isMobile,
    style,
    className,
    onClickEditBlock,
    isAppMenuFolded: isMenuFolded,
    onToggleFoldAppMenu: onToggleFoldMenu,
  } = props;

  const history = useHistory();
  const onSelectSettingsMenuItem = React.useCallback(
    (key: OrgHeaderSettingsMenuKey) => {
      switch (key) {
        case OrgHeaderSettingsMenuKey.EDIT:
          onClickEditBlock();
          break;
      }
    },
    [onClickEditBlock]
  );

  const onBack = React.useCallback(() => {
    history.push(appLoggedInPaths.organizations);
  }, [history]);

  const renderHeaderPrefixButton = () => {
    if (isMobile) {
      return (
        <div
          className={cx(
            classes.prefixBtnContainerMobile,
            classes.prefixBtnContainer
          )}
        >
          <Button
            style={{ cursor: "pointer" }}
            onClick={onBack}
            className="icon-btn"
          >
            <ArrowLeft />
          </Button>
        </div>
      );
    } else {
      return (
        <div
          className={cx(
            classes.prefixBtnContainerDesktop,
            classes.prefixBtnContainer
          )}
          onClick={onToggleFoldMenu}
        >
          {isMenuFolded ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      );
    }
  };

  return (
    <div className={cx(classes.header, className)} style={style}>
      {renderHeaderPrefixButton()}
      <Typography.Title
        level={5}
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          marginBottom: 0,
          textTransform: "capitalize",
        }}
      >
        {organization.name}
      </Typography.Title>
      <div className={classes.menuContainer}>
        <OrgHeaderOptionsMenu
          block={organization}
          onSelect={onSelectSettingsMenuItem}
        />
      </div>
    </div>
  );
};

export default React.memo(OrgBoardHeader);
