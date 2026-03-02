import { useState, useEffect, useCallback } from "react";
import md5 from 'md5';
import { toast } from "react-hot-toast";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { useNavigate } from "react-router-dom";

export const useUsuarios = (usuarioEdit = null) => {

    const navigate = useNavigate(); // 2. Inicializar el navegador
    // --- ESTADOS PARA FORMULARIO (Basados en tu Tabla SQL) ---
    const [idRol, setIdRol] = useState({ campo: '', valido: null });
    const [nombre, setNombre] = useState({ campo: '', valido: null });
    const [ap1, setAp1] = useState({ campo: '', valido: null });
    const [ap2, setAp2] = useState({ campo: '', valido: 'true' }); // Opcional en DB
    const [ci, setCi] = useState({ campo: '', valido: null });
    const [celular, setCelular] = useState({ campo: '', valido: null });
    const [direccion, setDireccion] = useState({ campo: '', valido: null });
    const [username, setUsername] = useState({ campo: '', valido: null });
    const [password, setPassword] = useState({ campo: '', valido: null });
    const [estado, setEstado] = useState({ campo: 1, valido: 'true' });

    // --- ESTADOS PARA LISTADO ---
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [cargando, setCargando] = useState(false);

    // ... dentro del Hook useUsuarios
    const [roles, setRoles] = useState([]);

    const listarRoles = useCallback(async () => {
        const endpoint = `${URL}usuarios/listar-roles`; // Ajusta a tu ruta de backend
        const res = await start(endpoint, null, );
        if (res) {
            setRoles(res);
        }
    }, []);

    // 1. LISTAR USUARIOS
    const listarUsuarios = useCallback(async () => {
        setCargando(true);
        const endpoint = `${URL}usuarios/listar`;
        // Enviamos un objeto vacío o un límite si tu backend lo requiere
        const res = await start(endpoint, { usuario: 100 });

        if (res) {
            setUsuarios(res);
            setUsuariosFiltrados(res);
        }   
        setCargando(false);
    }, []);

    // 2. GUARDAR O ACTUALIZAR (Adaptado a tu tabla)
    const guardarUsuario = async (e, idParaEditar = null) => {
        if (e) e.preventDefault();

        // Estructura base
        const data = {
            id_rol: idRol.campo,
            nombre: nombre.campo,
            ap1: ap1.campo,
            ap2: ap2.campo,
            ci: ci.campo,
            celular: celular.campo,
            direccion: direccion.campo,
            username: username.campo,
            estado: estado.campo || 1
        };

        // Lógica de Contraseña: Solo la incluimos si tiene contenido
        // Así evitamos sobreescribir con vacío al editar
        if (password.campo && password.campo.trim() !== "") {
            data.password = md5(password.campo);
        }

        const endpoint = `${URL}usuarios/${idParaEditar ? `editar` : `crear`}`;

        // Si hay idParaEditar, lo incluimos en el cuerpo del envío
        const payload = idParaEditar ? { ...data, id: idParaEditar } : data;

        const res = await saveDB(endpoint, payload);

        if (res) {
            // toast.success(idParaEditar ? 'Usuario actualizado' : 'Usuario creado');

            listarUsuarios();
            // 4. Redirigir a la ruta de la tabla (ajusta la ruta según tu App.js)
            setTimeout(() => {
                navigate(LOCAL_URL + '/admin/lista-usuarios');
            }, 1000); // Esperamos 1 segundo para que el usuario vea el toast de éxito
            return true;
        }
        return false;
    };

    // 3. ELIMINAR
    const eliminarUsuario = async (id, estado) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            const res = await start(`${URL}usuarios/cambiar-estado`, { id, estado }, "Eliminando...");
            if (res) {
                // setUsuarios(prev => prev.filter(u => u.id !== id));
                // setUsuariosFiltrados(prev => prev.filter(u => u.id !== id));
                listarUsuarios();
                toast.success("Eliminado correctamente");
            }
        }
    };

    // 4. BUSQUEDA FILTRADA
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        if (!busqueda) {
            setUsuariosFiltrados(usuarios);
            return;
        }

        const filtrados = usuarios.filter((u) => (
            (u.nombre_completo && u.nombre_completo.toLowerCase().includes(busqueda)) ||
            (u.ci && u.ci.toLowerCase().includes(busqueda)) ||
            (u.username && u.username.toLowerCase().includes(busqueda))
        ));
        setUsuariosFiltrados(filtrados);
    };

    const listUsuariosActivos = () => {
        setUsuariosFiltrados(usuarios.filter(u => u.estado == 1));
    };

    const allList = () => setUsuariosFiltrados(usuarios);

    // Cargar al inicio
    useEffect(() => {
        listarUsuarios();
        listarRoles(); // Cargamos roles al iniciar
    }, [listarUsuarios, listarRoles]);

    return {
        usuariosFiltrados,
        roles,
        handleSearch,
        allList,
        listUsuariosActivos,
        cargando,
        estados: { idRol, nombre, ap1, ap2, ci, celular, direccion, username, password, estado },
        setters: { setIdRol, setNombre, setAp1, setAp2, setCi, setCelular, setDireccion, setUsername, setPassword, setEstado },
        guardarUsuario,
        eliminarUsuario,
        listarUsuarios
    };
};