import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { useNavigate } from "react-router-dom";

export const useClientes = () => {
    const navigate = useNavigate();

    // --- ESTADOS PARA FORMULARIO (Tabla Clientes) ---
    const [nombre, setNombre] = useState({ campo: '', valido: null });
    const [ap1, setAp1] = useState({ campo: '', valido: null });
    const [ap2, setAp2] = useState({ campo: '', valido: 'true' }); // Opcional
    const [ci, setCi] = useState({ campo: '', valido: null });
    const [celular, setCelular] = useState({ campo: '', valido: null });
    const [direccion, setDireccion] = useState({ campo: '', valido: null });
    const [estado, setEstado] = useState({ campo: 1, valido: 'true' });

    // --- ESTADOS PARA LISTADO ---
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [cargando, setCargando] = useState(false);

    // 1. LISTAR CLIENTES
    const listarClientes = useCallback(async () => {
        setCargando(true);
        const endpoint = `${URL}clientes/listar`;
        // Pasamos el ID del usuario actual si tu backend lo usa para filtrar logs
        const res = await start(endpoint, { usuario: 1 }, );

        if (res) {
            setClientes(res);
            setClientesFiltrados(res);
        }
        setCargando(false);
    }, []);

    // 2. GUARDAR O ACTUALIZAR
    const guardarCliente = async (e, idParaEditar = null) => {
        if (e) e.preventDefault();

        // 1. Preparamos el objeto con los datos
        const data = {
            nombre: nombre.campo,
            ap1: ap1.campo,
            ap2: ap2.campo,
            ci: ci.campo,
            celular: celular.campo,
            direccion: direccion.campo,
            estado: estado.campo || 1,
            usuario: 1, // ID del usuario (sesión)
            fecha_: new Date().toISOString()
        };

        // 2. Definimos endpoint y payload (incluimos ID si es edición)
        const endpoint = `${URL}clientes/${idParaEditar ? 'editar' : 'crear'}`;
        const payload = idParaEditar ? { ...data, id: idParaEditar } : data;

        // 3. Llamamos a saveDB
        // Pasamos: url, datos, callback de éxito, y el setter de carga
        const res = await saveDB(
            endpoint,
            payload,
            () => {
                // Este bloque se ejecuta solo si res.ok === true
                listarClientes(); // Refresca la lista en el estado global

                setTimeout(() => {
                    navigate(LOCAL_URL + '/admin/lista-clientes');
                }, 1000);
            },
            setCargando // Asegúrate de tener este useState en tu Hook
        );

        return res;
    };

    // 3. CAMBIAR ESTADO (ACTIVAR/DESACTIVAR)
    const toggleEstadoCliente = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 1 ? 0 : 1;
        const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';

        if (window.confirm(`¿Estás seguro de ${accion} este cliente?`)) {
            const res = await start(`${URL}clientes/cambiar-estado`, {
                id,
                estado: nuevoEstado,
                usuario: 1,
                fecha_: new Date().toISOString()
            }, "Cambiando estado...");

            if (res) {
                toast.success(res.msg || "Estado actualizado");
                listarClientes(); // Recargamos la lista
            }
        }
    };

    // 4. BUSQUEDA FILTRADA
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        if (!busqueda) {
            setClientesFiltrados(clientes);
            return;
        }

        const filtrados = clientes.filter((c) => (
            (c.nombre_completo && c.nombre_completo.toLowerCase().includes(busqueda)) ||
            (c.ci && c.ci.toLowerCase().includes(busqueda)) ||
            (c.celular && c.celular.toLowerCase().includes(busqueda))
        ));
        setClientesFiltrados(filtrados);
    };

    const listUsuariosActivos = () => {
        setClientesFiltrados(clientes.filter(u => u.estado == 1));
    };

    const allList = () => setClientesFiltrados(clientes);

    // Cargar al inicio
    useEffect(() => {
        listarClientes();
    }, [listarClientes]);

    return {
        clientesFiltrados,
        handleSearch,
        cargando,
        estados: { nombre, ap1, ap2, ci, celular, direccion, estado },
        setters: { setNombre, setAp1, setAp2, setCi, setCelular, setDireccion, setEstado },
        guardarCliente,
        toggleEstadoCliente,
        listarClientes, listUsuariosActivos, allList
    };
};