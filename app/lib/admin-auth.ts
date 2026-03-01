import "server-only";

export const ADMIN_COOKIE_NAME = "pinetoyzz_admin_session";
export const ADMIN_SESSION_VALUE = "active";

const ADMIN_EMAIL = "admin@pinetoyzz.com";
const ADMIN_PASSWORD = "PineAdmin@123";

export function isValidAdminCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

export function getAdminUser() {
  return {
    name: "PineToyzz Admin",
    email: ADMIN_EMAIL,
  };
}
