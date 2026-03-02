import { Navigate } from "react-router-dom";

import { LOCAL_URL } from "../Auth/config";
import useAuth from "../Auth/useAuth"


export default function PublicRoute({ component: Component, ...rest }) {
    const auth = useAuth();
    let url = null

    if (parseInt(localStorage.getItem('numRol')) === 4) {
        url = "/auxiliar/lista-caja"
    }
    if (parseInt(localStorage.getItem('numRol')) === 3) {
        url = "/cajero/movimientos"
    }
    if (parseInt(localStorage.getItem('numRol')) === 2) {
        url = "/gerente/movimientos"
    }
    if (parseInt(localStorage.getItem('numRol')) === 1) {
        url = "/admin/lista-caja"
    }
    return (
        auth.isLogged() ? (
            <Navigate to={url ? LOCAL_URL + url : LOCAL_URL + '/login'} replace />
        ) : (
            <Component /> // RUTA PUBLICA
        )
    );
} 