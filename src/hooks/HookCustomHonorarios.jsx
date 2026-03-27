import { useState } from "react";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";
import { useNavigate } from "react-router-dom";
import { ticketHonorarioIndividual } from "../pdfMake/honorarios";
import { generarReporteHonorariosExcel } from "../reportes/honorarios";
import toast from "react-hot-toast";
// Supongo que crearás un PDF específico para recibos de honorarios
// import ticketHonorarioIndividual from "../pdfMake/honorarios"; 

export const UseCustomHonorarios = () => {
    const navigate = useNavigate();

    // ESTADOS DEL FORMULARIO
    const [idHonorario, setIdHonorario] = useState({ campo: '', valido: null });
    const [idTramite, setIdTramite] = useState({ campo: '', valido: null });
    const [monto, setMonto] = useState({ campo: '', valido: null });

    const [tipoPago, setTipoPago] = useState({ campo: 'Efectivo', valido: 'true' }); // Default Efectivo
    const [descripcion, setDescripcion] = useState({ campo: '', valido: null });
    const [fechaIngreso, setFechaIngreso] = useState({ campo: '', valido: null });

    const [desde, setDesde] = useState({ campo: '', valido: null });
    const [hasta, setHasta] = useState({ campo: '', valido: null });

    // ESTADOS DE DATOS
    const [honorarios, setHonorarios] = useState([]);
    const [honorariosFiltrados, setHonorariosFiltrados] = useState([]);
    const [cargando, setCargando] = useState(false);

    // 1. LISTAR HONORARIOS DE UN TRÁMITE
    const listarHonorarios = async () => {
        const res = await start(`${URL}honorarios/listar-honorarios`);
        if (res) {
            setHonorarios(res);
            setHonorariosFiltrados(res);
        }
    };

    // 1. LISTAR HONORARIOS DE UN TRÁMITE
    const listarHonorariosReporte = async (desde, hasta) => {

        const generarDocumento = async () => {
            const res = await start(`${URL}honorarios/listar-honorarios-reportes`, { desde, hasta });
            if (res) {
                generarReporteHonorariosExcel(desde, hasta, res);

            }
        }
        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando reporte Excel...',
            success: (msg) => <b>{msg}</b>,
            error: (err) => <b>{err.message}</b>,
        }, {
            style: {
                minWidth: '250px',
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            success: {
                duration: 4000,
                icon: '📄',
            },
        });
    };

    // 2. CARGAR PARA EDICIÓN
    const cargarHonorarioPorId = async (id) => {
        setCargando(true);
        const res = await start(`${URL}honorarios/obtener`, { id });
        if (res && res.length > 0) {
            const data = res[0];

            setIdHonorario({ campo: data.id, valido: 'true' });
            setIdTramite({ campo: data.id_tramite, valido: 'true' });
            setMonto({ campo: data.monto, valido: 'true' });
            setTipoPago({ campo: data.tipo_pago, valido: 'true' });
            setDescripcion({ campo: data.descripcion, valido: 'true' });
            setFechaIngreso({
                campo: data.fecha_ingreso?.split('T')[0],
                valido: 'true'
            });
        }
        setCargando(false);
    };

    // 3. GUARDAR (CREAR O ACTUALIZAR)
    const handleGuardar = async (e, esEdicion = false) => {
        if (e) e.preventDefault();

        const urlFinal = esEdicion ? 'actualizar' : 'crear';

        const payload = {
            ...(esEdicion && { id: idHonorario.campo }),
            id_tramite: idTramite.campo,
            monto: monto.campo,
            tipo_pago: tipoPago.campo,
            descripcion: descripcion.campo,
            fecha_ingreso: fechaIngreso.campo,
            datosAuditoriaExtra
        };

        return await saveDB(
            `${URL}honorarios/${urlFinal}`,
            payload,
            () => {
                const rol = parseInt(localStorage.getItem('numRol'))
                const path = rol === 1 ? 'admin' : rol === 2 ? 'gerente' : rol === 3 ? 'cajero' : ''
                const rutaDestino = `${LOCAL_URL}/${path}/listar-honorarios/`;
                setTimeout(() => {
                    navigate(rutaDestino);
                }, 1000);
            },
            setCargando
        );
    };

    // 4. ELIMINAR (BORRADO LÓGICO)
    const eliminarHonorario = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este registro de honorario?")) return;

        try {
            setCargando(true);
            const res = await start(`${URL}honorarios/obtener`, { id });

            if (res && res.length > 0) {
                const data = res[0];

                const resEliminar = await start(`${URL}honorarios/eliminar`, {
                    id,
                    data: data,
                }, 'Eliminando honorario...');

                if (resEliminar) {
                    listarHonorarios();
                }
            }
        } catch (error) {
            console.error("Error en eliminarHonorario:", error);
        } finally {
            setCargando(false);
        }
    };

    // EXPORTAR PDF
    const exportPDfIngresos = async (output, row) => {
        // Generamos el PDF con el objeto 'row'}
        // console.log("Iniciando exportación...",  row );
        const generarDocumento = async () => {
            const response = await ticketHonorarioIndividual(output, row);
            // console.log(response, ' reponse')
            if (!response?.success) {
                alert(response?.message);
                return;
            }

            if (output === "b64") {
                const byteCharacters = atob(response.content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/pdf" });

                const nombreArchivo = `ingreso_${row.numero + ' Tramite ' + row.codigo_tramite || 'sin-numero'}.pdf`;

                // MÉTODO DE DESCARGA NATIVO (A prueba de fallos)
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = nombreArchivo;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                console.log("3. Descarga iniciada");
            }
        }
        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando reporte Excel...',
            success: (msg) => <b>{msg|| 'Reporte PDF generado'}</b>,
            error: (err) => <b>{err.message}</b>,
        }, {
            style: {
                minWidth: '250px',
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            success: {
                duration: 4000,
                icon: '📄',
            },
        });

    };

    // 5. BUSCADOR
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = honorarios.filter(h =>
            h.codigo_tramite?.toLowerCase().includes(busqueda) ||
            h.cliente?.toLowerCase().includes(busqueda)
        );
        setHonorariosFiltrados(filtrados); 
    };

    return {
        honorarios,
        honorariosFiltrados,
        cargando,
        estados: { idTramite, monto, tipoPago, descripcion, fechaIngreso, idHonorario, desde, hasta },
        setters: { setIdTramite, setMonto, setTipoPago, setDescripcion, setFechaIngreso, setDesde, setHasta },
        listarHonorarios,
        cargarHonorarioPorId,
        exportPDfIngresos,
        listarHonorariosReporte,
        handleGuardar,
        eliminarHonorario,
        handleSearch,
        allListHonorarios: () => setHonorariosFiltrados(honorarios),
    };
};