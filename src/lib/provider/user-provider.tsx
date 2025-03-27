"use client";
import { createContext, useContext } from "react";
import { User } from "@/lib/schema";

const UserContext = createContext<User | null>(null);
export const useUser = () => {
  return useContext(UserContext);
};
export const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
