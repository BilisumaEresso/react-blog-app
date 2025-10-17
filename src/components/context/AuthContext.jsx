import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext(null);

export const Authaprovider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const stringifyblogData = window.localStorage.getItem("blogData");
    if (stringifyblogData) {
      const blogData = JSON.parse(stringifyblogData);
      const user = blogData.user;
      setAuth(user);
    } else {
      setAuth(null);
    }
  }, [navigate, location]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};
