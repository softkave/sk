import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../models/user/user";
import OrgsListContainer from "../org/OrgsListContainer";
import StyledContainer from "../styled/Container";
import AppHomeDesktopMenu from "./AppHomeDesktopMenu";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeDesktopProps {
  user: IUser;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const AppHomeDesktop: React.FC<IAppHomeDesktopProps> = (props) => {
  const { user, onSelect } = props;

  return (
    <StyledContainer
      s={{
        height: "100%",
        width: "280px",
        minWidth: "280px",
        borderRight: "1px solid rgb(223, 234, 240)",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <StyledContainer
        s={{
          height: "56px",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: "1px solid rgb(223, 234, 240)",
        }}
      >
        <Typography.Title
          type="secondary"
          level={4}
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: "16px",
            alignItems: "center",
            display: "flex",
          }}
        >
          <StyledLink to="/app">
            <Typography.Text
              type="secondary"
              className={css({
                fontSize: "12px",
                marginBottom: "6px",
              })}
            >
              Boards by
            </Typography.Text>
            <br />
            SOFTKAVE
          </StyledLink>
        </Typography.Title>
      </StyledContainer>
      <StyledContainer
        s={{
          flex: 1,
        }}
      >
        <OrgsListContainer />
      </StyledContainer>
      <AppHomeDesktopMenu user={user} onSelect={onSelect} />
    </StyledContainer>
  );
};

export default AppHomeDesktop;

const StyledLink = styled(Link)({ color: "inherit !important" });
