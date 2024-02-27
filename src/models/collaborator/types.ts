import { IResource } from "../app/types";

export type ICollaborator = IResource & {
  customId: string;
  firstName: string;
  lastName: string;
  email: string;
  color: string;
};
