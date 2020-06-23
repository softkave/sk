import { createAction } from "@reduxjs/toolkit";
import { IUser } from "../../models/user/user";
import { IMergeDataMeta } from "../../utils/utils";

const addUser = createAction<IUser>("users/addUser");

const updateUser = createAction<{
  id: string;
  data: Partial<IUser>;
  meta?: IMergeDataMeta;
}>("users/updateUser");

const deleteUser = createAction<string>("users/deleteUser");

const bulkAddUsers = createAction<IUser[]>("users/bulkAddUsers");

const bulkUpdateUsers = createAction<
  Array<{ id: string; data: Partial<IUser>; meta?: IMergeDataMeta }>
>("users/bulkUpdateUsers");

const bulkDeleteUsers = createAction<string[]>("users/bulkDeleteUsers");

class UserActions {
  public static addUser = addUser;
  public static updateUser = updateUser;
  public static deleteUser = deleteUser;
  public static bulkAddUsers = bulkAddUsers;
  public static bulkUpdateUsers = bulkUpdateUsers;
  public static bulkDeleteUsers = bulkDeleteUsers;
}

export default UserActions;
