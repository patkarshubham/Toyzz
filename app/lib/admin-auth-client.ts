export const ADMIN_STORAGE_KEY = "pinetoyzz_admin_session";
export const ADMIN_SESSION_VALUE = "active";

export const ADMIN_DEMO_EMAIL = "admin@pinetoyzz.com";
export const ADMIN_DEMO_PASSWORD = "PineAdmin@123";

export function validateAdminCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === ADMIN_DEMO_EMAIL.toLowerCase() &&
    password === ADMIN_DEMO_PASSWORD
  );
}
