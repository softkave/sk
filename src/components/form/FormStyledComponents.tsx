import styled from "@emotion/styled";
import ScrollList from "../ScrollList";

export const FormBodyContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%"
});

export const FormScrollList = styled(ScrollList)({
  flex: "1",
  display: "flex",
  width: "100%"
});

export const FormBody = styled("div")({
  padding: "24px",
  width: "100%"
});

export const FormControls = styled("div")({
  display: "flex",
  padding: "24px"
});

export const StyledForm = styled("form")`
  height: 100%;
`;
