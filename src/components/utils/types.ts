import { MenuProps } from "antd";
import { RouteComponentProps } from "react-router-dom";
import { IAppError } from "../../utils/errors";
import { UnpackArray } from "../../utils/types";

export interface IFormError<T extends object | undefined> {
  errorList: IAppError[];
  errors: T & { error?: string };
}

export interface IAppRoute {
  exact?: boolean;
  path: string;
  render: (props: RouteComponentProps) => JSX.Element;
}

export type AntDMenuItemType = NonNullable<UnpackArray<MenuProps["items"]>>;
export type ElementError = string | string[] | Error | Error[] | IAppError | IAppError[];
