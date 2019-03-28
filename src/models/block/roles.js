export const defaultRolesMap = {
  public: 0,
  collaborator: 1,
  lead: 2,
  admin: 3
};

export const defaultRoles = ["public", "collaborator", "lead", "admin"];

export function generateRolesArr(rolesParam) {
  if (Array.isArray(rolesParam)) {
    return rolesParam.map(role => {
      return {
        role
      };
    });
  } else if (typeof rolesParam === "object") {
    return Object.keys(rolesParam).map(key => ({
      role: key
    }));
  }
}

export function getDefaultRolesArr() {
  return generateRolesArr(defaultRolesMap);
}

export function getPersonalRolesArr() {
  return [
    {
      role: "admin"
    }
  ];
}
