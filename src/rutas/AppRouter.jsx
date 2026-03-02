import {
  createBrowserRouter,
  Outlet,
  BrowserRouter as Router,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import useAuth from "../Auth/useAuth";
import { LOCAL_URL, TIEMPO_INACTIVO } from "../Auth/config";
import Check from "./check";
import PublicRoute from "./publicRoute";
import E500 from "./e500";

import HomeLogin from "../Login";
import NavbarAdmin from "../components/etc/menuAdmin";
import { Footer } from "../components/Footer";

import NuevoTramite from "../tramite/NuevoTramite";
import { ListaTramites } from "../tramite/ListaTramites";

import NuevoUsuario from "../usuario/NuevoUsuario";
import { ListaUsuarios } from "../usuario/ListaUsuario";

import NuevoCliente from "../cliente/NuevoCliente";
import { ListaClientes } from "../cliente/ListaClientes";

import ListaTipoTramite from "../tipoTramite/ListaTipoTramites";
import NuevoTipoTramite from "../tipoTramite/NuevoTipoTramite";


import NavbarAuxiliar from "../components/etc/menuAuxiliar";
import { ListaTramitesS } from "../salidas/ListaTramites";
import { ListaSalidas } from "../salidas/ListaSalidas";
import FormularioSalida from "../salidas/FormularioSalida";


import NavbarGerente from "../components/etc/menuGerente";
import { ListaTramitesGerente } from "../salidasGerente/ListaTramites";
import { ListaSalidasGerente } from "../salidasGerente/ListaSalidas";

import NavbarCajero from "../components/etc/menuCajero";
import { ListaTramitesCajero } from "../salidasCajero/ListaTramites";
import { ListaSalidasCajero } from "../salidasCajero/ListaSalidas";

import { ListaIngresosTramite } from "../ingresosCajero/ListaIngresos";
import FormularioIngreso from "../ingresosCajero/FormularioIngreso";
import { ReportesAdministracionPorTramite } from "../reportes/reportesAdministracionPorTramite";
import { ReportesAdministracionConsolidado } from "../reportes/reportesAdministracionConsolidado";


export default function AppRouter() {
  const auth = useAuth();

  useEffect(() => {
    async function check() {
      if (localStorage.getItem("token") != null) {
        const inter = setInterval(() => {
          const tiempo1 = localStorage.getItem("tiempo");
          if (!tiempo1 || localStorage.getItem("token") == null) {
            auth.logout();
          } // sino existe el cookie redireccionamos a la ventana login
          const tiempo2 = new Date().getMinutes();
          let dif = 0;
          let aux1 = 0;
          let aux2 = 0;
          const maximo = 59;
          const inicio = 0;
          if (tiempo1 === tiempo2) {
            dif = 0;
          }
          if (tiempo2 > tiempo1) {
            dif = tiempo2 - tiempo1;
          }
          if (tiempo1 > tiempo2) {
            aux1 = maximo - tiempo1; //  59 - 50 = 10
            aux2 = tiempo2 - inicio; //  5 - 0  = 5
            dif = aux2 - aux1;
          }
          if (dif >= TIEMPO_INACTIVO) {
            // el tiempo de abandono tolerado, se define en el archivo varEntorno en unidades de tiempo MINUTOS
            auth.logout();
          }
        }, 10000);
        return inter;
      }
    }
    check()
  }, [auth]);

  useEffect(() => {
    return () => { };
  }, []);

  const handleKeyPress = () => {
    localStorage.setItem("tiempo", new Date().getMinutes());
  };

  const handleClick = () => {
    localStorage.setItem("tiempo", new Date().getMinutes());
  };

  const ruta1 = createBrowserRouter([

    // --- GRUPO 1: RUTAS PÚBLICAS LOGIN (Sin Navbar) ---
    {
      path: LOCAL_URL + "/login",
      errorElement: <E500 />,
      children: [
        { path: "", element: <PublicRoute component={HomeLogin} /> },
      ]
    },
    {
      path: LOCAL_URL + '/admin',
      element: <>
        <NavbarAdmin />
        <main className="main-content">
          {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}

          <Outlet />

        </main>
      </>, // El Layout siempre se muestra
      errorElement: <E500 />,
      children: [

        {
          path: 'lista-empleadores',
          element: <Check component={ListaClientes} roleRequired="admin" />,
        },
        {
          path: 'nuevo-empleador',
          element: <Check component={NuevoCliente} roleRequired="admin" />,
        },
        {
          path: 'editar-empleador/:id',
          element: <Check component={NuevoCliente} roleRequired="admin" />,
        },


        {
          path: 'lista-usuarios',
          element: <Check component={ListaUsuarios} roleRequired="admin" />,
        },
        {
          path: 'nuevo-usuario',
          element: <Check component={NuevoUsuario} roleRequired="admin" />,
        },
        {
          path: 'editar-usuario/:id',
          element: <Check component={NuevoUsuario} roleRequired="admin" />,
        },


        {
          path: 'lista-caja',
          element: <Check component={ListaTramites} roleRequired="admin" />,
        },
        {
          path: 'nuevo-caja',
          element: <Check component={NuevoTramite} roleRequired="admin" />,
        },
        {
          path: 'editar-caja/:id',
          element: <Check component={NuevoTramite} roleRequired="admin" />,
        },


        {
          path: 'lista-tipo-caja',
          element: <Check component={ListaTipoTramite} roleRequired="admin" />,
        },
        {
          path: 'nuevo-tipo-caja',
          element: <Check component={NuevoTipoTramite} roleRequired="admin" />,
        },
        {
          path: 'editar-tipo-caja/:id',
          element: <Check component={NuevoTipoTramite} roleRequired="admin" />,
        },

        {
          path: 'reportes-por-caja',
          element: <Check component={ReportesAdministracionPorTramite} roleRequired="admin" />,
        },
        {
          path: 'reportes-consolidado',
          element: <Check component={ReportesAdministracionConsolidado} roleRequired="admin" />,
        },
      ],
    },


    // RUTAS AUXILIAR
    {
      path: LOCAL_URL + '/auxiliar',
      element: <>
        <NavbarAuxiliar />
        <main className="main-content">
          {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}
          <Outlet />
        </main>
      </>, // El Layout siempre se muestra
      errorElement: <E500 />,
      children: [

        {
          path: 'lista-caja',
          element: <Check component={ListaTramitesS} roleRequired="auxiliar" />,
        },

        {
          path: 'listar-salidas/:id',
          element: <Check component={ListaSalidas} roleRequired="auxiliar" />,
        },

        {
          path: 'salidas/crear/:id_tramite',
          element: <Check component={FormularioSalida} roleRequired="auxiliar" />,
        },

        {
          path: 'salidas/editar/:id_tramite/:id',
          element: <Check component={FormularioSalida} roleRequired="auxiliar" />,
        },


        {
          path: 'reportes-por-caja',
          element: <Check component={ReportesAdministracionPorTramite} roleRequired="auxiliar" />,
        },
        {
          path: 'reportes-consolidado',
          element: <Check component={ReportesAdministracionConsolidado} roleRequired="auxiliar" />,
        },
      ],
    },


    // RUTAS GERENTE
    {
      path: LOCAL_URL + '/gerente',
      element: <>
        <NavbarGerente />
        <main className="main-content">
          {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}
          <Outlet />
        </main>
      </>, // El Layout siempre se muestra
      errorElement: <E500 />,
      children: [

        {
          path: 'movimientos',
          element: <Check component={ListaTramitesCajero} roleRequired="gerente" />,// ListaTramitesGerente>paa fuciones avanzadas
        },

        // {
        //   path: 'listar-salidas/:id',
        //   element: <Check component={ListaSalidasGerente} roleRequired="gerente" />, 
        // },
        {
          path: 'listar-salidas/:id',
          element: <Check component={ListaSalidas} roleRequired="gerente" />,  // ListaSalidasCajero-> para la funcion de avanzado, despachar salidas
        },

        {
          path: 'salidas/crear/:id_tramite',
          element: <Check component={FormularioSalida} roleRequired="gerente" />,
        },

        {
          path: 'salidas/editar/:id_tramite/:id',
          element: <Check component={FormularioSalida} roleRequired="gerente" />,
        },


        // {
        //   path: 'listar-ingresos/:id',
        //   element: <Check component={ListaIngresosTramite} roleRequired="gerente" />,
        // },
        {
          path: 'listar-ingresos/:id',
          element: <Check component={ListaIngresosTramite} roleRequired="gerente" />,
        },

        {
          path: 'crear-ingreso/:id_tramite',
          element: <Check component={FormularioIngreso} roleRequired="gerente" />,
        },
        {
          path: 'editar-ingreso/:id_tramite/:id',
          element: <Check component={FormularioIngreso} roleRequired="gerente" />,
        },

        {
          path: 'lista-caja',
          element: <Check component={ListaTramites} roleRequired="gerente" />,
        },
        {
          path: 'nuevo-caja',
          element: <Check component={NuevoTramite} roleRequired="gerente" />,
        },
        {
          path: 'editar-caja/:id',
          element: <Check component={NuevoTramite} roleRequired="gerente" />,
        },


        {
          path: 'lista-empleadores',
          element: <Check component={ListaClientes} roleRequired="gerente" />,
        },
        {
          path: 'nuevo-empleador',
          element: <Check component={NuevoCliente} roleRequired="gerente" />,
        },

        {
          path: 'editar-empleador/:id',
          element: <Check component={NuevoCliente} roleRequired="gerente" />,
        },

        {
          path: 'reportes-por-caja',
          element: <Check component={ReportesAdministracionPorTramite} roleRequired="gerente" />,
        },
        {
          path: 'reportes-consolidado',
          element: <Check component={ReportesAdministracionConsolidado} roleRequired="gerente" />,
        },


      ],
    },



    // RUTAS CAJERO
    {
      path: LOCAL_URL + '/cajero',
      element: <>
        <NavbarCajero />
        <main className="main-content">
          {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}
          <Outlet />
        </main>
      </>, // El Layout siempre se muestra
      errorElement: <E500 />,
      children: [

        {
          path: 'lista-empleadores',
          element: <Check component={ListaClientes} roleRequired="cajero" />,
        },
        {
          path: 'nuevo-empleador',
          element: <Check component={NuevoCliente} roleRequired="cajero" />,
        },
        {
          path: 'editar-empleador/:id',
          element: <Check component={NuevoCliente} roleRequired="cajero" />,
        },

        {
          path: 'movimientos',
          element: <Check component={ListaTramitesCajero} roleRequired="cajero" />,
        },
        {
          path: 'lista-caja',
          element: <Check component={ListaTramites} roleRequired="cajero" />,
        },
        {
          path: 'nuevo-caja',
          element: <Check component={NuevoTramite} roleRequired="cajero" />,
        },
        {
          path: 'editar-caja/:id',
          element: <Check component={NuevoTramite} roleRequired="cajero" />,
        },



        {
          path: 'listar-salidas/:id',
          element: <Check component={ListaSalidas} roleRequired="cajero" />,  // ListaSalidasCajero-> para la funcion de avanzado, despachar salidas
        },

        {
          path: 'salidas/crear/:id_tramite',
          element: <Check component={FormularioSalida} roleRequired="cajero" />,
        },

        {
          path: 'salidas/editar/:id_tramite/:id',
          element: <Check component={FormularioSalida} roleRequired="cajero" />,
        },



        // OTRAS RUTAS

        {
          path: 'listar-ingresos/:id',
          element: <Check component={ListaIngresosTramite} roleRequired="cajero" />,
        },

        {
          path: 'crear-ingreso/:id_tramite',
          element: <Check component={FormularioIngreso} roleRequired="cajero" />,
        },
        {
          path: 'editar-ingreso/:id_tramite/:id',
          element: <Check component={FormularioIngreso} roleRequired="cajero" />,
        },

        {
          path: 'reportes-por-caja',
          element: <Check component={ReportesAdministracionPorTramite} roleRequired="cajero" />,
        },
        {
          path: 'reportes-consolidado',
          element: <Check component={ReportesAdministracionConsolidado} roleRequired="cajero" />,
        },

      ],
    },



  ]);
  return (
    <div onClick={handleClick} onKeyPress={handleKeyPress} >
      <RouterProvider router={ruta1} />
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          duration: 4000,
          style: {
            padding: '20px 30px',
            background: "#fff",
            // fontWeight:'bold',
            color: "#4E5AFE",
            fontSize: "14px",
          },
        }} />
    </div>
  );
}
