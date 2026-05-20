"use client";

import { createContext, useState, ReactNode } from "react";

export type Role = "buyer" | "merchant" | "admin";

export const RoleContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
}>({ role: "buyer", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("buyer");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
