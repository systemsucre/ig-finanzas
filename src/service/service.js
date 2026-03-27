import { LOCAL_URL, URL } from "../Auth/config";
import axios from "axios";
import toast from "react-hot-toast";



axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        const token = localStorage.getItem("token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tiempo");
        localStorage.removeItem("numRol");
        axios.post(URL + "/logout", { token: token });
        // window.location.href = LOCAL_URL + "/";
        window.location.href = LOCAL_URL + "/";
        return Promise.reject(error);
    }
);


/**
 * Realiza peticiones HTTP con manejo de carga, errores y validación de sesión.
 */
async function start(url, payload = null, msg = null) {
    let loadingToast = null;

    // alert(token, '               LISTAR')

    try {
        if (msg) loadingToast = toast.loading(msg);

        // Optimizamos la petición: si payload es nulo, enviamos objeto vacío o null
        const response = await axios.post(url, payload);
        const { data } = response;


        // 1. Manejo centralizado de sesión expirada
        // console.log(data)
        if (data.hasOwnProperty("sesion")) {
            console.log(data, ' sesion desde el servidor')
            handleSessionError();
            return [];  
        }

        // console.log(data, ' res bc service')
        // 2. Manejo de respuesta exitosa según tu estructura { ok, data, msg }
        if (data.ok) {
            if (msg) toast.success(data.msg)
            return data.data || [];
        } else {
            toast.error(data.msg || "Error desconocido");
            
            return [];
        }

    } catch (error) {
        // Manejo de errores de red o servidor (500, 404, etc)
        const errorMessage = error.response?.data?.msg || error.message || "Error de conexión";
        toast.error(errorMessage);
        return [];
    } finally {
        // Siempre cerramos el loading, pase lo que pase
        if (loadingToast) toast.dismiss(loadingToast);
    }
}

/**
 * Función auxiliar para limpiar la sesión y redirigir
 */
function handleSessionError() {
    const errorMsg = "LA SESIÓN FUE CERRADA DESDE EL SERVIDOR. POR FAVOR, INICIE SESIÓN NUEVAMENTE.";
    toast.error(errorMsg);
    alert(errorMsg);

    const token = localStorage.getItem("token");
    // Limpieza masiva de datos locales
    ["token", "user", "tiempo", "numRol"].forEach(key => localStorage.removeItem(key));

    // Notificamos al servidor del logout de forma silenciosa
    axios.post(`${URL}logout`, { token }).catch(() => { });

    window.location.href = LOCAL_URL + "/login/";
}


async function buscarDB(url, dato) {
    try {
        const loadingToast = toast.loading('Cargando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.hasOwnProperty("sesion")) {
            toast.error("LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO");
            alert("LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO");
            const token = localStorage.getItem("token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("tiempo");
            localStorage.removeItem("numRol");
            axios.post(URL + "/logout", { token: token });
            window.location.href = "/";
        }
        if (data.data.ok) return data.data.data
        else {
            toast.error(data.data.msg);
            return []
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
        return []
    }
}


async function saveDB_IMG(url, dato, modal, estado, reload = false, vaciar = null) {
    try {
        const loadingToast = toast.loading('Guardando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {

            toast.success(data.data.msg)
            estado(0)
            modal(false)

            if (vaciar) vaciar()
            if (reload) window.location.reload()
            return data.data.data
        } else {
            estado(0)
            toast.error(data.data.msg);
            if (document.getElementById(data.data.campo))
                document.getElementById(data.data.campo).style.display = 'flex'
            return
        }

    }
    catch (error) {
        estado(0)
        console.log('error al conectar a la base de datos')
        toast.error(error.toJSON().message);
    }
}

/**
 * Función genérica para guardar o editar en la DB
 * @param {string} url - Endpoint del backend
 * @param {object} dato - Objeto con los datos a enviar
 * @param {function} onSuccess - Callback opcional al tener éxito (ej: redirigir o recargar lista)
 * @param {function} setCargando - Función para cambiar el estado de carga (opcional)
 */
async function saveDB(url, dato, onSuccess = null, setCargando = null) {
    try {
        if (setCargando) setCargando(true);
        const loadingToast = toast.loading('Procesando solicitud...');

        const response = await axios.post(url, dato);
        toast.dismiss(loadingToast);

        const res = response.data;

        if (res.ok) {
            toast.success(res.msg || "Guardado correctamente");

            // Si pasamos una función de éxito (como navegar a la lista)
            if (onSuccess) onSuccess();

            return true;
        } else {
            // Manejo de errores de validación del backend (tu middleware validaciones)
            toast.error(res.msg || "Error en los datos enviados");

            // Si el backend nos dice qué campo falló, podemos enfocarlo o marcarlo
            if (res.data) {
                console.warn(`Error en el campo: ${res.data}`);
                const element = document.getElementsByName(res.data)[0];
                if (element) {
                    element.focus();
                    element.classList.add('is-invalid'); // Clase de Bootstrap si se usa
                }
            }
            return false;
        }

    } catch (error) {
        toast.dismiss();
        console.error('Error de conexión:', error);

        const errorMsg = error.response?.data?.msg || "No se pudo conectar con el servidor";
        toast.error(errorMsg);

        return false;
    } finally {
        if (setCargando) setCargando(false);
    }
}
async function editDB(url, dato, modal = null, reload = false, vaciar = null) {
    try {
        const loadingToast = toast.loading('Actualizando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {
            toast.success(data.data.msg)
            modal(false)
            if (vaciar) vaciar()
            if (reload) window.location.reload()
            return
        }
        else {
            toast.error(data.data.msg);
            if (document.getElementById(data.data.campo))
                document.getElementById(data.data.campo).style.display = 'flex'
            return
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
    }
}

async function eliminarDB(url, dato) {
    try {
        const loadingToast = toast.loading('Eliminando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {
            toast.success(data.data.msg)
            return
        }
        else {
            toast.error(data.data.msg);
            return
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
    }
}

async function defaultDB(url, dato = null, msg = null) {
    try {
        const loadingToast = toast.loading(!msg ? 'Procesando información...' : msg);
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {
            toast.success(data.data.msg)
            return
        }
        else {
            toast.error(data.data.msg);
            return
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
    }
}


export { start, buscarDB, saveDB, saveDB_IMG, editDB, eliminarDB, defaultDB }