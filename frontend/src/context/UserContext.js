import { createContext } from "react";

import useAuth from "../hooks/useAuth";

const Context = createContext();

function UserProvider({ children }) {
  const { authenticated, Register, logout } = useAuth();

  return (
    <Context.Provider value={{ authenticated, Register, logout }}>
      {children}
    </Context.Provider>
  )
}

export { Context, UserProvider }