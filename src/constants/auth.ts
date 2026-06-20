import { UserRole } from "./roles";

export const RESOURCE_MANAGER_EMAIL =
  process.env.RESOURCE_MANAGER_EMAIL ?? "akash1111@yopmail.com";

export function resolveRoleForEmail(email: string): UserRole {
  return email.toLowerCase().trim() === RESOURCE_MANAGER_EMAIL
    ? UserRole.RESOURCE_MANAGER
    : UserRole.USER;
}
