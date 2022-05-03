import { RouteComponentProps } from "react-router-dom";
import { IAppError } from "../../net/types";

export interface IFormError<T extends object | undefined> {
  errorList: IAppError[];
  errors: T & { error?: string };
}

export interface IAppRoute {
  exact?: boolean;
  path: string;
  render: (props: RouteComponentProps) => JSX.Element;
}
