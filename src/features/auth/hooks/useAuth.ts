"use client";

import { useState, useEffect } from "react";
import type { AdminUser } from "../types/auth.types";

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Since middleware handles auth redirection, we can assume if we're here, user is authenticated
  useEffect(() => {
    // Set a default user object (actual user data can be fetch from an API if needed)
    setUser({
      id: 1,
      name: "Admin",
      email: "admin@example.com",
      phone: "",
      role: "admin",
    });
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    try {
      // Placeholder for future auth refresh logic
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch,
  };
}
