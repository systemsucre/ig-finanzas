import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_URL, URL } from "./config";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  useEffect(() => {
    async function check() {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        const token = localStorage.getItem("token");
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tiempo");
        axios.post(URL + "/logout", { token: token });
        return <Navigate to='/login' />
      }
    }
    check();
    return;
  }, [user]);

  ///////////////////////////////////////////////////////////////

  let altura = window.innerHeight;
  let cantidad = 6;
  const asientos = [];
  if (altura > 700) cantidad = 8;
  if (altura > 850) cantidad = 10;
  if (altura > 1100) cantidad = 16;
  if (altura > 1250) cantidad = 23;
  const contextValue = {
    user,
    logout: async () => {
      const token = localStorage.getItem("token"); // 1. Recuperar token primero
      console.log("Token a eliminar:", token);

      try {
        if (token) {
          // 2. Intentar el borrado en BD (Asegúrate que URL no termine en /)
          axios.post(`${URL}logout`, { token: token });
        }
      } catch (error) {
        console.error("No se pudo borrar en BD, procediendo a limpiar local", error);
      }

      // 3. LIMPIAR DESPUÉS de la petición
      setUser(null);
      localStorage.clear();
      window.location.href = LOCAL_URL + "/login";
    },

    login(ok) {
      setUser(ok);
    },

    isLogged() {
      return !!user;
    },
    cantidad,
    asientos,
  };
  return (<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>);
};
export default AuthProvider;
