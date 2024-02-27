import { useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";

export interface IUseTabbedRouteProps {
  base: string;
  defaultRoute: string;
}

export interface IUseTabbedRouteResult {
  selectedKey: string;
  tempNode: React.ReactElement | null;
}

export function useTabbedRoute(props: IUseTabbedRouteProps): IUseTabbedRouteResult {
  const { base, defaultRoute } = props;
  const routeMatch = useRouteMatch<{
    currentRoute?: string;
  }>(`${base}/:currentRoute`);

  const currentRoute = routeMatch?.params.currentRoute;
  const selectedKey = `${base}/${currentRoute}`;
  let tempNode: React.ReactNode = null;

  if (!currentRoute) {
    tempNode = <Redirect to={defaultRoute} />;
  }

  return { selectedKey, tempNode };
}
