import { css } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../models/user/user";
import HeaderMobileMenu from "./HeaderMobileMenu";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IHeaderMobileProps {
  user: IUser;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const HeaderMobile: React.FC<IHeaderMobileProps> = (props) => {
  const { user, onSelect } = props;

  return (
    <div
      className={css({
        display: "flex",
        width: "100%",
        padding: "16px 16px",
        borderBottom: "1px solid rgb(223, 234, 240)",
      })}
    >
      <div style={{ flex: 1 }}>
        <Typography.Title
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: "16px",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Link to="/app" className={css({ color: "inherit !important" })}>
            Softkave
          </Link>
        </Typography.Title>
      </div>
      <div style={{ marginLeft: "16px" }}>
        <HeaderMobileMenu user={user} onSelect={onSelect} />
      </div>
    </div>
  );
};

export default HeaderMobile;
