import { css } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import RenderForDevice from "../../components/RenderForDevice";
import FaceLink from "./FaceLink";

const desktopStyles: Record<string, React.CSSProperties> = {
  p1: { textAlign: "center", fontSize: "32px", margin: "32px 0" },
  p2: { textAlign: "center", marginBottom: "24px", fontSize: "16px" },
  face: {
    justifyContent: "center",
    maxWidth: "520px",
    margin: "auto",
    alignItems: "center",
  },
};

const faceClassName = css({
  height: "100%",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const buttonsContainerClassName = css({
  display: "flex",
  flexWrap: "wrap",
});

const mobileStyles: Record<string, React.CSSProperties> = {
  p1: { fontSize: "24px", margin: "24px 0" },
  p2: { marginBottom: "24px", fontSize: "16px" },
  face: {},
};

const Face: React.FC<{}> = () => {
  const render = (mobile = false) => {
    const styles = mobile ? mobileStyles : desktopStyles;
    return (
      <div style={styles.face} className={faceClassName}>
        <h1
          style={{
            fontSize: "16px",
            textTransform: "uppercase",
            margin: 0,
            letterSpacing: "1px",
            fontWeight: "bold",
          }}
        >
          Softkave
        </h1>
        <Typography.Paragraph
          style={{
            letterSpacing: "0.5px",
            ...styles.p1,
          }}
        >
          Chat and tasks platform built for startups
        </Typography.Paragraph>
        <Typography.Text style={styles.p2}>
          The best part is, Softkave is free for your first year! Then, it's a $2 per user per
          month.
        </Typography.Text>
        <div className={buttonsContainerClassName}>
          <FaceLink to="/signup" style={{ backgroundColor: "#36B37E" }} text="Signup" />
          <FaceLink to="/login" style={{ backgroundColor: "#6554C0" }} text="Login" />
          <FaceLink
            to="/forgot-password"
            style={{ backgroundColor: "#00B8D9" }}
            text="Forgot Password"
          />
        </div>
      </div>
    );
  };

  return (
    <RenderForDevice renderForDesktop={() => render(false)} renderForMobile={() => render(true)} />
  );
};

export default Face;
