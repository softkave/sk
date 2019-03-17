export const defaultRolesMap = {
  public: 0,
  collaborator: 1,
  lead: 2,
  admin: 3
};

export function generateRolesArr(rolesParam) {
  if (Array.isArray(rolesParam)) {
    return rolesParam.map((role, index) => {
      return {
        role,
        level: index
      };
    });
  } else if (typeof rolesParam === "object") {
    return Object.keys(rolesParam).map(key => ({
      role: key,
      level: rolesParam[key]
    }));
  }
}

export function getDefaultRolesArr() {
  return generateRolesArr(defaultRolesMap);
}

export function getPersonalRolesArr() {
  return [{
    role: "admin",
    level: defaultRolesMap.admin
  }];
}