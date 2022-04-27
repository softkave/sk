import { MenuOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button } from "antd";
import React from "react";
import { X } from "react-feather";
import { Link } from "react-router-dom";
import RenderForDevice from "../../components/RenderForDevice";

const classes = {
  menuItem: css({
    justifyContent: "flex-end",
    lineHeight: "40px",
  }),
  menu: css({
    flexDirection: "column",
    width: "100%",
    padding: "16px 0",
    paddingTop: "8px",
  }),
  oneRoot: css({ flex: 1, display: "flex" }),
  oneRootInner: css({
    flex: 1,
    marginRight: "16px",
    flexDirection: "column",
  }),
  title: css({
    fontWeight: "bold",
    fontSize: "16px",
    margin: 0,
  }),
  linksContainer: css({ alignItems: "center" }),
  link: css({
    padding: "0 16px",
  }),
  root: css({
    width: "100%",
    margin: "auto",
    flexDirection: "column",
    padding: "16px",
    display: "flex",
  }),
  menuBtn: css({
    color: "rgba(0,0,0,0.65)",
    display: "inline-flex",
    alignItems: "center",
  }),
};

const WebHeader: React.FC<{}> = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const renderMenuItemContent = (content: React.ReactNode) => (
    <div className={classes.menuItem}>
      <span onClick={() => setShowMenu(false)}>{content}</span>
    </div>
  );

  const renderMenu = () => {
    return (
      <div className={classes.menu}>
        <Link to="/app?demo=true">{renderMenuItemContent("Try Demo")}</Link>
        <Link to="/signup">{renderMenuItemContent("Signup")}</Link>
        <Link to="/login">{renderMenuItemContent("Login")}</Link>
        <Link to="/forgot-password">
          {renderMenuItemContent("Forgot Password")}
        </Link>
      </div>
    );
  };

  const renderOne = (isMobile: boolean) => {
    return (
      <div className={classes.oneRoot}>
        <div className={classes.oneRootInner}>
          <Link to="/">
            <h1 className={classes.title}>Softkave</h1>
          </Link>
        </div>
        <div className={classes.linksContainer}>
          {!showMenu && !isMobile && (
            <Link to="/signup" className={classes.link}>
              Signup
            </Link>
          )}
          {!showMenu && !isMobile && (
            <Link to="/login" className={classes.link}>
              Login
            </Link>
          )}
          <Button
            type="link"
            className={classes.menuBtn}
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <X style={{ width: "20px" }} /> : <MenuOutlined />}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <RenderForDevice
        renderForDesktop={() => renderOne(false)}
        renderForMobile={() => renderOne(true)}
      />
      {showMenu && renderMenu()}
    </div>
  );
};

export default WebHeader;
