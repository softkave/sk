import { css } from "@emotion/css";
import { SystemResourceType } from "../../models/app/types";
import { BoardResourceType } from "../board/types";

export const organizationSidebarClasses = {
  list: css({
    height: "100%",
    width: "100%",
    flexDirection: "column",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto 1fr",
  }),
  header: css({
    padding: "0 16px",
    marginBottom: "8px",
    marginTop: "8px",
  }),
};

export function organizationResourceTypeToSystemResourceType(
  organizationResourceType: BoardResourceType
): SystemResourceType {
  switch (organizationResourceType) {
    case "boards":
      return SystemResourceType.Board;
    case "chat":
      return SystemResourceType.Chat;
    case "collaborators":
      return SystemResourceType.Collaborator;
    case "collaboration-requests":
      return SystemResourceType.CollaborationRequest;
    default:
      return SystemResourceType.Board;
  }
}

export function systemResourceTypeToOrganizationResourceType(
  systemResourceType: SystemResourceType
): BoardResourceType {
  switch (systemResourceType) {
    case SystemResourceType.Board:
      return "boards";
    case SystemResourceType.Chat:
      return "chat";
    case SystemResourceType.Collaborator:
      return "collaborators";
    case SystemResourceType.CollaborationRequest:
      return "collaboration-requests";
    default:
      return "boards";
  }
}
