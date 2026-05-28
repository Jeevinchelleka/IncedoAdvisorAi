"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

/**
 * ProtectedRoute — wraps pages that require authentication.
 * Redirects to /login if no valid session.
 * Optionally restricts to specific roles.
 */
export default function ProtectedRoute({ children, requiredRoles }) {
  const { user, role, loading, initialized, init } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) init();
  }, [initialized, init]);

  useEffect(() => {
    if (!initialized || loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      router.replace("/dashboard"); // redirect to dashboard if wrong role
    }
  }, [user, role, loading, initialized, requiredRoles, router]);

  if (!initialized || loading) {
    return (
      <div className="h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (requiredRoles && !requiredRoles.includes(role)) return null;

  return children;
}
