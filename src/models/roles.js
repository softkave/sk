export const defaultRolesMap = {
  public: 0,
  collaborator: 1,
  lead: 2,
  admin: 3
};

export function generateRolesArr(rolesObj) {
  return Object.keys(rolesObj).map(key => ({
    role: key,
    level: rolesObj[key]
  }));
}

export function getDefaultRolesArr() {
  return generateRolesArr(defaultRolesMap);
}

export function getPersonalRolesArr() {
  return [{ role: "admin", level: defaultRolesMap.admin }];
}
