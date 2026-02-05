export const checkPermission = (
  rolePermission,
  moduleName,
  action = "canRead"
) => {
  if (
    !rolePermission ||
    !Array.isArray(rolePermission?.rolesPermissionDetails)
  ) {
    return false;
  }

  const module = rolePermission.rolesPermissionDetails.find(
    (m) => m.moduleName === moduleName
  );

  return module ? !!module[action] : false;
};
