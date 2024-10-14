import { User } from "@/schema/User";
import { createContext, useContext, Dispatch, SetStateAction } from "react";

interface UserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});

export function useUserContext() {
  return useContext(UserContext);
}
