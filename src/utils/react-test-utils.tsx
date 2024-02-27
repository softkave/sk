import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";

const AllTheProviders: FC = ({ children }: { children?: React.ReactNode }) => {
  return (
    // @ts-ignore
    <BrowserRouter>
      {/* @ts-ignore */}
      <Provider store={store}>{children}</Provider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
