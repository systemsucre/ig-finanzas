import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { useNavigate } from "react-router-dom";
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";

export const useTipoTramite = () => {
    const navigate = useNavigate();

    // --- ESTADOS PARA FORMULARIO (Tabla tipo_tramites) ---
    const [tipo_tramite, setTipoTramite] = useState({ campo: '', valido: null });
    const [codigo, setCodigo] = useState({ campo: '', valido: false });

    const [estado, setEstado] = useState({ campo: 1, valido: 'true' });

    // --- ESTADOS PARA LISTADO ---
    const [tramites, setTramites] = useState([]);
    const [tramitesFiltrados, setTramitesFiltrados] = useState([]);
    const [cargando, setCargando] = useState(false);

    // 1. LISTAR TRÁMITES
    const listarTramites = useCallback(async () => {
        setCargando(true);
        const endpoint = `${URL}tipo-tramites/listar`;

        // Usamos start para obtener el array de datos directamente
        const res = await start(endpoint, { usuario: 1 });

        if (res) {
            setTramites(res);
            setTramitesFiltrados(res);
        }
        setCargando(false);
    }, []);

    // 2. GUARDAR O ACTUALIZAR
    const guardarTramite = async (e, idParaEditar = null) => {
        if (e) e.preventDefault();
        // Estructura según tu tabla tipo_tramites
        const data = {
            tipo_tramite: tipo_tramite.campo,
            codigo: codigo.campo,
            estado: estado.campo || 1,
          datosAuditoriaExtra
        };

        const endpoint = `${URL}tipo-tramites/${idParaEditar ? 'editar' : 'crear'}`;
        const payload = idParaEditar ? { ...data, id: idParaEditar } : data;

        const res = await saveDB(
            endpoint,
            payload,
            () => {
                listarTramites(); // Refresca la tabla
                // Limpiar campo tras guardar si es nuevo
                if (!idParaEditar) setTipoTramite({ campo: '', valido: null });

                setTimeout(() => {
                    navigate(LOCAL_URL + '/admin/lista-tipo-tramites');
                }, 1000);
            },
            setCargando
        );

        return res;
    };

    // 3. CAMBIAR ESTADO (ACTIVAR/DESACTIVAR)
    const toggleEstadoTramite = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 1 ? 0 : 1;
        const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';

        if (window.confirm(`¿Estás seguro de ${accion} este tipo de trámite?`)) {
            const res = await start(`${URL}tipo-tramites/cambiar-estado`, {
                id,
                estado: nuevoEstado,
                datosAuditoriaExtra
            }, "Actualizando estado...");

            if (res) {
                toast.success(res.msg || `Trámite ${accion}ado`);
                listarTramites();
            }
        }
    };

    // 4. BÚSQUEDA FILTRADA
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        if (!busqueda) {
            setTramitesFiltrados(tramites);
            return;
        }

        const filtrados = tramites.filter((t) => (
            (t.tipo_tramite && t.tipo_tramite.toLowerCase().includes(busqueda)) ||
            (t.id && t.id.toString().includes(busqueda))
        ));
        setTramitesFiltrados(filtrados);
    };

    const listActivos = () => {
        setTramitesFiltrados(tramites.filter(t => t.estado == 1));
    };

    const allList = () => setTramitesFiltrados(tramites);

    // Cargar al inicio
    useEffect(() => {
        listarTramites();
    }, [listarTramites]);

    return {
        tramitesFiltrados,
        handleSearch,
        cargando,
        estados: { tipo_tramite, codigo, estado },
        setters: { setTipoTramite, setCodigo, setEstado },
        guardarTramite,
        toggleEstadoTramite,
        listarTramites,
        listActivos,
        allList
    };
};