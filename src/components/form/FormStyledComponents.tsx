import styled from "@emotion/styled";

export const FormBodyContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%"
});

export const FormBody = styled("div")({
  padding: "16px 16px",
  width: "100%",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflow: "auto"
});

export const FormControls = styled("div")({
  display: "flex",
  padding: "16px 16px",
  borderTop: "1px solid #e8e8e8"
});

export const StyledForm = styled("form")`
  height: 100%;
`;
