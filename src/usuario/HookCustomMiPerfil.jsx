import { useState, useEffect, useCallback } from "react";
import md5 from 'md5';
import { toast } from "react-hot-toast";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { useNavigate } from "react-router-dom";
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";


export const useMiPerfil = (usuarioEdit = null) => {

    // --- ESTADOS PARA FORMULARIO (Basados en tu Tabla SQL) ---
    const navigate = useNavigate()
    const [idRol, setIdRol] = useState({ campo: '', valido: null });
    const [user, setUser] = useState({ campo: '', valido: null });
    const [nombre, setNombre] = useState({ campo: '', valido: null });
    const [ap1, setAp1] = useState({ campo: '', valido: null });
    const [ap2, setAp2] = useState({ campo: '', valido: 'true' }); // Opcional en DB
    const [ci, setCi] = useState({ campo: '', valido: null });
    const [celular, setCelular] = useState({ campo: '', valido: null });
    const [direccion, setDireccion] = useState({ campo: '', valido: null });
    const [estado, setEstado] = useState({ campo: 1, valido: 'true' });

    const [pass, setPass] = useState({ campo: null, valido: null });
    const [pass1, setPass1] = useState({ campo: null, valido: null });
    const [pass2, setPass2] = useState({ campo: null, valido: null });

    // --- ESTADOS PARA LISTADO ---
    const [cargando, setCargando] = useState(false);

    // ... dentro del Hook useUsuarios



    // 1. LISTAR USUARIOS
    const miPerfil = async (msg = 'Cargando datos, Espere por favor...') => {
        let loadingToast = null
        if (msg) loadingToast = toast.loading(msg);
        const data = await start(URL + 'miperfil/ver',)
        if (msg) toast.dismiss(loadingToast);

        if (data.length > 0) {
            setIdRol({ campo: data[0].rol, valido: 'true' })
            setUser({ campo: data[0].username, valido: 'true' })
            setNombre({ campo: data[0].nombre, valido: 'true' })
            setAp1({ campo: data[0].ap1, valido: 'true' })
            setAp2({ campo: data[0].ap2, valido: 'true' })
            setCi({ campo: data[0].ci, valido: 'true' })
            setDireccion({ campo: data[0].direccion, valido: 'true' })
            setCelular({ campo: data[0].celular, valido: 'true' })
        }
    };

    // 2. GUARDAR O ACTUALIZAR (Adaptado a tu tabla)
    const actualizar = async (e) => {
        if (e) e.preventDefault();
        await saveDB(URL + 'miperfil/actualizarMiPerfil', {
            nombre: nombre.campo,
            ap1: ap1.campo,
            ap2: ap2.campo,
            direccion: direccion.campo,
            ci: ci.campo,
            celular: celular.campo,
            direccion: direccion.campo,
            datosAuditoriaExtra
        },)
        navigate(`${LOCAL_URL + '/dash-1'}`)
    }

    const recet_ = async () => {
        if (pass.valido === 'true' && pass1.valido === 'true' && pass2.valido === 'true') {
            if (pass1.campo === pass2.campo) {
                let accion = window.confirm('cambiar contraseña ?')
                if (accion) {
                    await saveDB(URL + 'miperfil/cambiarMiContrasena', {
                        pass: md5(pass.campo),
                        pass1: md5(pass1.campo),
                        datosAuditoriaExtra

                    })
                    navigate(`${LOCAL_URL + '/dash-1'}`)
                }
            } else toast.error('las contraseñas no coinciden!, verifique e intente nuevamente')
        } else toast.error('complete todos los campos')
    }




    // Cargar al inicio
    useEffect(() => {
        miPerfil();
    }, []);

    return {
        cargando,
        estados: { idRol, nombre, ap1, ap2, ci, celular, direccion, pass, pass1, pass2, estado, user },
        setters: { setIdRol, setNombre, setAp1, setAp2, setCi, setCelular, setDireccion, setPass, setPass1, setPass2, setEstado },
        actualizar,
        recet_,
    };
};