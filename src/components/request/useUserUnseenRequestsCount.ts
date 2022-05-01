import React from "react";
import { useUserRequests } from "./useUserRequests";

export function useUserUnseenRequestsCount(): number {
  const { requests } = useUserRequests();
  const count = React.useMemo(() => {
    return requests.filter((request) => !request.readAt).length;
  }, [requests]);

  return count;
}
