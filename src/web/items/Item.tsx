import React from "react";
import RenderForDevice from "../../components/RenderForDevice";
import StyledContainer from "../../components/styled/Container";

export interface IWebItemProps {
  label: React.ReactNode;
  content: React.ReactNode;
}

interface IWebItemStyles {
  main: React.CSSProperties;
  label: React.CSSProperties;
  content: React.CSSProperties;
}

const mobileStyles: IWebItemStyles = {
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "white",
    borderBottom: "1px solid #d9d9d9",
  },
  label: {
    padding: "16px",
    paddingBottom: "0",
    order: 1,
    borderBottom: "1px solid #d9d9d9",
  },
  content: { order: 2, padding: "16px" },
};

const desktopStyles: IWebItemStyles = {
  main: {
    width: "100%",
    backgroundColor: "white",
    borderRight: "1px solid #d9d9d9",
    borderBottom: "1px solid #d9d9d9",
  },
  label: { flex: 1, order: 1, padding: "24px" },
  content: {
    padding: "24px",
    flex: 1,
    order: 2,
    boxSizing: "content-box",
  },
};

const WebItem: React.FC<IWebItemProps> = (props) => {
  const { label, content } = props;

  const render = React.useCallback(
    (styles: IWebItemStyles) => {
      return (
        <StyledContainer s={styles.main}>
          <StyledContainer s={styles.content}>{content}</StyledContainer>
          <StyledContainer s={styles.label}>{label}</StyledContainer>
        </StyledContainer>
      );
    },
    [content, label]
  );

  return (
    <RenderForDevice
      renderForDesktop={() => render(desktopStyles)}
      renderForMobile={() => render(mobileStyles)}
    />
  );
};

export default WebItem;
