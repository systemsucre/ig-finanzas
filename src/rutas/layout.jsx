// Componente Layout.js
// import { Outlet } from "react-router-dom";
// import NavbarCajero from "./NavbarCajero";
// import NavbarAdmin from "./NavbarAdmin"; // Supongamos que tienes otros
// import NavbarGerente from "./NavbarGerente";

import NavbarAdmin from "../components/etc/menuAdmin";
import NavbarAuxiliar from "../components/etc/menuAuxiliar";
import NavbarGerente from "../components/etc/menuGerente";
import NavbarCajero from "../components/etc/menuCajero";
import { Outlet } from "react-router-dom";

export function LayoutPorRol() {
  const userRole = localStorage.getItem('numRol');

//   alert(userRole)
  const renderNavbar = () => {
    switch (userRole) {
      case '1': return <NavbarAdmin />;
      case '2': return <NavbarGerente />;
      case '3': return <NavbarCajero />;
      case '4': return <NavbarAuxiliar />;
      default: return <NavbarCajero />; // O un navbar simple
    }
  };

  return (
    <>
      {renderNavbar()}
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}