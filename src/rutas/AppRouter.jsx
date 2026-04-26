import {
  createBrowserRouter,
  Outlet,
  BrowserRouter as Router,
  RouterProvider,
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import useAuth from '../Auth/useAuth';
import { LOCAL_URL, TIEMPO_INACTIVO } from '../Auth/config';
import Check from './check';
import PublicRoute from './publicRoute';
import E500 from './e500';

import HomeLogin from '../Login';
import { Footer } from '../components/Footer';

import NuevoTramite from '../tramite/NuevoTramite';
import { ListaTramites } from '../tramite/ListaTramites';

import NuevoUsuario from '../usuario/NuevoUsuario';
import { ListaUsuarios } from '../usuario/ListaUsuario';

import NuevoCliente from '../cliente/NuevoCliente';
import { ListaClientes } from '../cliente/ListaClientes';

import ListaTipoTramite from '../tipoTramite/ListaTipoTramites';
import NuevoTipoTramite from '../tipoTramite/NuevoTipoTramite';

import NavbarAdmin from '../components/etc/menuAdmin';
import NavbarAuxiliar from '../components/etc/menuAuxiliar';
import NavbarGerente from '../components/etc/menuGerente';
import NavbarCajero from '../components/etc/menuCajero';

// ALL USERS
import { Movimientos } from '../tramite/Movimientos';
import { ListaSalidas } from '../salidas/ListaSalidas';

import { ReportesAdministracionPorTramite } from '../reportes/reportesAdministracionPorTramite';
import { ReportesAdministracionConsolidado } from '../reportes/reportesAdministracionConsolidado';

import { ListaBoleta } from '../boleta/Lista';
import { FormularioBoleta } from '../boleta/Formulario';
import { DetallesBoleta } from '../boleta/detalles';
import { LayoutPorRol } from './layout';
import { ListaHonorariosTramite } from '../honorarios/Lista';
import FormularioHonorario from '../honorarios/FormularioHonorarios';
import { ReportesHonorarios } from '../reportes/reportesHonorarios';
import { ReportesMovimientos } from '../reportes/ReportesPorMovimientos';

import DashboardFinanciero from '../reportes/DashboardFinanciero';
import MiContrasena from '../usuario/miContrasena';
import MiPerfil from '../usuario/miPerfil';

import { ListaIngresosTramite } from '../ingresos/ListaIngresos';
import { ListaIngresosDeuda } from '../ingresos/ListaIngresosDeuda';
import FormularioIngreso from '../ingresos/FormularioIngreso';
import FormularioIngresoDeuda from '../ingresos/FormularioIngresoDeuda';
import FormularioCompletarIngreso from '../ingresos/FormularioCompletarIngreso';

export default function AppRouter() {
  const auth = useAuth();

  useEffect(() => {
    async function check() {
      if (localStorage.getItem('token') != null) {
        const inter = setInterval(() => {
          const tiempo1 = localStorage.getItem('tiempo');
          if (!tiempo1 || localStorage.getItem('token') == null) {
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
    check();
  }, [auth]);

  useEffect(() => {
    return () => {};
  }, []);

  const handleKeyPress = () => {
    localStorage.setItem('tiempo', new Date().getMinutes());
  };

  const handleClick = () => {
    localStorage.setItem('tiempo', new Date().getMinutes());
  };

  const ruta1 = createBrowserRouter([
    // --- GRUPO 1: RUTAS PÚBLICAS LOGIN (Sin Navbar) ---
    {
      path: LOCAL_URL + '/login',
      errorElement: <E500 />,
      children: [{ path: '', element: <PublicRoute component={HomeLogin} /> }],
    },

    {
      path: LOCAL_URL + '/admin',
      element: (
        <>
          <NavbarAdmin />
          <main className="main-content">
            {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}

            <Outlet />
          </main>
        </>
      ), // El Layout siempre se muestra
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
          path: 'lista-cajas',
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
          path: 'reporte-honorarios',
          element: (
            <Check component={ReportesHonorarios} roleRequired="admin" />
          ),
        },
      ],
    },

    // RUTAS AUXILIAR
    {
      path: LOCAL_URL + '/auxiliar',
      element: (
        <>
          <NavbarAuxiliar />
          <main className="main-content">
            {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}
            <Outlet />
          </main>
        </>
      ), // El Layout siempre se muestra
      errorElement: <E500 />,
      children: [],
    },

    // RUTAS GERENTE
    {
      path: LOCAL_URL + '/gerente',
      element: (
        <>
          <NavbarGerente />
          <main className="main-content">
            {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}
            <Outlet />
          </main>
        </>
      ), // El Layout siempre se muestra
      errorElement: <E500 />,
      children: [
        {
          path: 'lista-cajas',
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
          path: 'listar-honorarios',
          element: (
            <Check component={ListaHonorariosTramite} roleRequired="gerente" />
          ),
        },
        {
          path: 'guardar-honorario',
          element: (
            <Check component={FormularioHonorario} roleRequired="gerente" />
          ),
        },
        {
          path: 'editar-honorario/:id',
          element: (
            <Check component={FormularioHonorario} roleRequired="gerente" />
          ),
        },

        {
          path: 'reporte-honorarios',
          element: (
            <Check component={ReportesHonorarios} roleRequired="gerente" />
          ),
        },
      ],
    },

    // RUTAS CAJERO
    {
      path: LOCAL_URL + '/cajero',
      element: (
        <>
          <NavbarCajero />
          <main className="main-content">
            {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}
            <Outlet />
          </main>
        </>
      ), // El Layout siempre se muestra
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
          path: 'listar-honorarios',
          element: (
            <Check component={ListaHonorariosTramite} roleRequired="cajero" />
          ),
        },
        {
          path: 'guardar-honorario',
          element: (
            <Check component={FormularioHonorario} roleRequired="cajero" />
          ),
        },
        {
          path: 'editar-honorario/:id',
          element: (
            <Check component={FormularioHonorario} roleRequired="cajero" />
          ),
        },

        {
          path: 'reporte-honorarios',
          element: (
            <Check component={ReportesHonorarios} roleRequired="cajero" />
          ),
        },

        {
          path: 'ingresos-directos',
          element: (
            <Check component={ListaIngresosTramite} roleRequired="cajero" />
          ),
        },
        {
          path: 'ingresos-pendientes',
          element: (
            <Check component={ListaIngresosDeuda} roleRequired="cajero" />
          ),
        },

        {
          path: 'nuevo-ingreso-directo',
          element: (
            <Check component={FormularioIngreso} roleRequired="cajero" />
          ),
        },
        {
          path: 'nuevo-ingreso-pendiente',
          element: (
            <Check component={FormularioIngresoDeuda} roleRequired="cajero" />
          ),
        },

        {
          path: 'editar-ingreso-directo/:id',
          element: (
            <Check component={FormularioIngreso} roleRequired="cajero" />
          ),
        },

        {
          path: 'editar-ingreso-pendiente/:id',
          element: (
            <Check component={FormularioIngresoDeuda} roleRequired="cajero" />
          ),
        },

        {
          path: 'completar-pago/:id',
          element: (
            <Check
              component={FormularioCompletarIngreso}
              roleRequired="cajero"
            />
          ),
        },

        {
          path: 'lista-cajas',
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
      ],
    },

    // ROUTES TO ALL USERS
    {
      path: LOCAL_URL + '/',
      element: <LayoutPorRol />,
      errorElement: <E500 />,
      children: [
        {
          path: 'boletas',
          element: <Check component={ListaBoleta} roleRequired="all" />,
        },
        {
          path: 'detalle-boleta/:codigo',
          element: <Check component={DetallesBoleta} roleRequired="all" />,
        },

        {
          path: 'nueva-boleta',
          element: <Check component={FormularioBoleta} roleRequired="all" />,
        },

        {
          path: 'modificar-boleta/:codigo',
          element: <Check component={FormularioBoleta} roleRequired="all" />,
        },

        {
          path: 'movimientos',
          element: <Check component={Movimientos} roleRequired="all" />,
        },

        {
          path: 'listar-salidas/:id',
          element: <Check component={ListaSalidas} roleRequired="all" />,
        },

        {
          path: 'reportes-por-caja',
          element: (
            <Check
              component={ReportesAdministracionPorTramite}
              roleRequired="all"
            />
          ),
        },
        {
          path: 'reporte-por-movimientos',
          element: <Check component={ReportesMovimientos} roleRequired="all" />,
        },
        {
          path: 'reportes-consolidado',
          element: (
            <Check
              component={ReportesAdministracionConsolidado}
              roleRequired="all"
            />
          ),
        },

        {
          path: 'dash-1',
          element: <Check component={DashboardFinanciero} roleRequired="all" />,
        },

        {
          path: 'perfil',
          element: <Check component={MiPerfil} roleRequired="all" />,
        },

        {
          path: 'c-pass',
          element: <Check component={MiContrasena} roleRequired="all" />,
        },
      ],
    },
  ]);
  return (
    <div onClick={handleClick} onKeyPress={handleKeyPress}>
      <RouterProvider router={ruta1} />
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          duration: 4000,
          style: {
            padding: '20px 30px',
            background: '#fff',
            // fontWeight:'bold',
            color: '#4E5AFE',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
