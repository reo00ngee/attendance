export interface AdminPageLink {
  label: string;
  path: string;
}

export const makeAdminPageLinks = (): AdminPageLink[] => {
  const links: AdminPageLink[] = [
    { label: "Admin Registration", path: "/admin/registration" },
    { label: "Admin Management", path: "/admin/management" },
    { label: "User Registration", path: "/admin/user_registration" },
    { label: "User Management", path: "/admin/user_management" },
    { label: "Company Registration", path: "/admin/company_registration" },
    { label: "Company Management", path: "/admin/company_management" },
  ];

  return links;
};
