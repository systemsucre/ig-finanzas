import { Navigate } from "react-router-dom";

import { LOCAL_URL } from "../Auth/config";
import useAuth from "../Auth/useAuth"


export default function PublicRoute({ component: Component, ...rest }) {
    const auth = useAuth();
    // let url = null

    // if (parseInt(localStorage.getItem('numRol')) === 4) {
    //     url = "/movimientos"
    // }
    // if (parseInt(localStorage.getItem('numRol')) === 3) {
    //     url = "/cajero/lista-tramites"
    // }
    // if (parseInt(localStorage.getItem('numRol')) === 2) {
    //     url = "/gerente/movimientos"
    // }
    // if (parseInt(localStorage.getItem('numRol')) === 1) {
    //     url = "/admin/lista-tramites"
    // } lista-usuarios
    return (
        auth.isLogged() ? (
            // <Navigate to={url ? LOCAL_URL+'/movimientos' : LOCAL_URL + '/login'} replace />
            // <Navigate to={LOCAL_URL + '/admin/lista-usuarios'} replace />
            <Navigate to={LOCAL_URL + '/dash-1'} replace />
        ) : (
            <Component /> // RUTA PUBLICA
        )
    );
} 