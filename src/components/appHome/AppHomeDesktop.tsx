import { css } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../models/user/user";
import OrgsListContainer from "../org/OrgsListContainer";
import AppHomeDesktopMenu from "./AppHomeDesktopMenu";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeDesktopProps {
  user: IUser;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const classes = {
  root: css({
    display: "flex",
    height: "100%",
    width: "280px",
    minWidth: "280px",
    borderRight: "1px solid rgb(223, 234, 240)",
    flexDirection: "column",
    overflowY: "auto",
  }),
  titleContainer: css({
    display: "flex",
    height: "56px",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid rgb(223, 234, 240)",
  }),
  title: css({
    margin: "0px !important",
    fontSize: "16px",
    lineHeight: "16px !important",
    alignItems: "center",
    display: "flex",
  }),
  boardsBy: css({
    fontSize: "12px",
    marginBottom: "6px",
  }),
  softkave: css({ fontSize: "16px" }),
  titleLink: css({ color: "inherit !important" }),
  orgsListContainer: css({
    flex: 1,
  }),
};

const AppHomeDesktop: React.FC<IAppHomeDesktopProps> = (props) => {
  const { user, onSelect } = props;
  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography.Title type="secondary" level={4} className={classes.title}>
          <Link to="/app" className={classes.titleLink}>
            <Typography.Text type="secondary" className={classes.boardsBy}>
              Boards by
            </Typography.Text>
            <br />
            <Typography.Text type="secondary" className={classes.softkave}>
              SOFTKAVE
            </Typography.Text>
          </Link>
        </Typography.Title>
      </div>
      <div className={classes.orgsListContainer}>
        <OrgsListContainer />
      </div>
      <AppHomeDesktopMenu user={user} onSelect={onSelect} />
    </div>
  );
};

export default AppHomeDesktop;
