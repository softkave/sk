import styled, { StyledComponent } from "@emotion/styled";
import { ComponentStyle } from "../types";

export const FormBody = styled("div")({
  padding: "16px 16px",
  width: "100%",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflow: "auto",
});

export const StyledForm = styled("form")`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;

  & .ant-typography {
    margin-bottom: 0;
  }

  & .ant-typography-edit-content {
    left: 0px;
  }
`;

export const formContentWrapperStyle: ComponentStyle = {
  height: "100%",
  width: "100%",
  padding: "16px 24px 24px 24px",
  overflowY: "auto",
  flexDirection: "column",
};

export const formInputContentWrapperStyle: ComponentStyle = {
  width: "100%",
  flex: 1,
  flexDirection: "column",
};
