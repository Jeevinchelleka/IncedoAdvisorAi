"use client";

import useAuthStore from "@/store/authStore";
import { ShieldAlert } from "lucide-react";

/**
 * RoleGuard — renders children only if user has permission.
 * Shows a denial message or nothing based on `silent` prop.
 *
 * Usage:
 *   <RoleGuard resource="compliance_alerts" action="write">
 *     <button>Resolve Alert</button>
 *   </RoleGuard>
 *
 *   <RoleGuard roles={["admin", "compliance"]}>
 *     <AdminPanel />
 *   </RoleGuard>
 */
export default function RoleGuard({ children, resource, action = "read", roles, silent = false }) {
  const { can, role } = useAuthStore();

  let allowed = true;

  if (roles) {
    allowed = roles.includes(role);
  } else if (resource) {
    allowed = can(resource, action);
  }

  if (!allowed) {
    if (silent) return null;
    return (
      <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3 text-xs text-red-400">
        <ShieldAlert size={14} />
        <span>Access restricted — your role ({role}) cannot {action} {resource}.</span>
      </div>
    );
  }

  return children;
}
