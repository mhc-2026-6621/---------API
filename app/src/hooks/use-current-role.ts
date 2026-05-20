"use client";

import { useContext } from "react";
import { RoleContext } from "@/contexts/RoleProvider";

export function useCurrentRole() {
  return useContext(RoleContext);
}
