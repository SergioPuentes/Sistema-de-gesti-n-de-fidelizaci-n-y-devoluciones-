import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const users = [
  { id: "cliente", password: "1234", role: "cliente" },
  { id: "cajero", password: "1234", role: "cajero" },
  { id: "admin", password: "1234", role: "admin" },
];

export function AuthProvider({ children }) {
  const [userType, setUserType] = useState(null);

  function login(id, password) {
    const user = users.find((u) => u.id === id && u.password === password);
    if (user) {
      setUserType(user.role);
      return true;
    } else {
      return false;
    }
  }

  function logout() {
    setUserType(null);
  }

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}