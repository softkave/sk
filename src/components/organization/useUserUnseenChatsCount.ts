import { defaultTo } from "lodash";
import React from "react";
import { useUserOrganizations } from "./useUserOrganizations";

export function useUserUnseenChatsCount(): number {
  const { organizations } = useUserOrganizations();
  const count = React.useMemo(() => {
    return organizations.reduce((acc, organization) => {
      return acc + defaultTo(organization.unseenChatsCount, 0);
    }, 0);
  }, [organizations]);

  return count;
}
