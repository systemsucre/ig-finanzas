import { Navigate } from "react-router-dom";
import useAuth from "../Auth/useAuth";
import { LOCAL_URL } from "../Auth/config";

export default function Check({ component: Component, roleRequired, ...rest }) {
    const auth = useAuth();

    // Obtenemos el rol desde el localStorage (asegúrate de que el nombre coincida con el que usas)
    const userRole = localStorage.getItem('numRol');

    // 1. Verificamos si está logueado
    if (!auth.isLogged()) {
        return <Navigate to={LOCAL_URL + '/login'} replace />;
    }

    // 2. Lógica de restricción: Si el rol es "Gerente" y la ruta requiere "Admin"
    // Supongamos que: Admin = 1, Gerente = 2
    if (userRole === '1' && roleRequired === 'admin') {
        // Redirigir a una página permitida para el Gerente o al Home
        return <Component />;
    }

    if (userRole === '2' && roleRequired === 'gerente') {
        // Redirigir a una página permitida para el Gerente o al Home
        return <Component />;
    }

    if (userRole === '3' && roleRequired === 'cajero') {
        // Redirigir a una página permitida para el Gerente o al Home
        return <Component />;
    }

    if (userRole === '4' && roleRequired === 'auxiliar') {
        // Redirigir a una página permitida para el Gerente o al Home
        return <Component />;
    }

    alert('Alerta, Ruta Prohibida ..')
    auth.logout()

    // Si pasa las validaciones, renderiza el componente
    return  //<Navigate to={LOCAL_URL + '/cajero/movimientos'} replace />;

}