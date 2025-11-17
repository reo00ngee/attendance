// check if user has this role (for authorization)
export function hasRole(requiredRoles: number[] | number): boolean {
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  const user = JSON.parse(userStr);
  const userRoles: number[] = user.roles || [];
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.some(role => userRoles.includes(role));
  }
  return userRoles.includes(requiredRoles);
}

// get user roles
export function getUserRoles(): number[] {
  const userStr = localStorage.getItem('user');
  if (!userStr) return [];
  const user = JSON.parse(userStr);
  return user.roles || [];
}