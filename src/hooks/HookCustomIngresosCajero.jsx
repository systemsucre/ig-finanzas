import { useState, } from "react";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";
import { useNavigate } from "react-router-dom";
import ticketIngresoIndividual from "../pdfMake/ingresos";

export const UseCustomIngresos = () => {
    const navigate = useNavigate();

    // ESTADOS DEL FORMULARIO (Sin estado para ID, ya que el server lo genera al insertar)
    const [monto, setMonto] = useState({ campo: '', valido: null }); // Solo para edición
    const [tipo, setTipo] = useState({ campo: '', valido: null }); // tipo transferencia
    const [idCliente, setIdCliente] = useState({ campo: '', valido: null });
    const [idIngreso, setIdIngreso] = useState({ campo: '', valido: null }); // Solo para edición
    const [idTramite, setIdTramite] = useState({ campo: '', valido: null });
    const [detalle, setDetalle] = useState({ campo: '', valido: null });
    const [fechaIngreso, setFechaIngreso] = useState({ campo: '', valido: null });

    // ESTADOS DE DATOS
    const [ingresos, setIngresos] = useState([]);
    const [ingresosFiltrados, setIngresosFiltrados] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [cargando, setCargando] = useState(false);



    // 2. LISTAR INGRESOS DE UN TRÁMITE
    const listarIngresos = async (id_tramite) => { 
        if (!id_tramite) return;
        const res = await start(`${URL}ingresos/listar-por-tramites`, { id_tramite });
        if (res) {
            setIngresos(res);
            setIngresosFiltrados(res);  
        }
    };

    // 3. CARGAR PARA EDICIÓN (Aquí sí seteamos el idIngreso para el WHERE del Update)
    const cargarIngresoPorId = async (id) => {
        setCargando(true);
        const res = await start(`${URL}ingresos/obtener`, { id });
        if (res) {
            const data = res[0];

            setIdIngreso({ campo: data.id, valido: 'true' });
            setMonto({ campo: data.monto, valido: 'true' });
            setIdCliente({ campo: data.id_cliente, valido: 'true' });
            setTipo({ campo: data.tipo, valido: 'true' });
            setIdTramite({ campo: data.id_tramite, valido: 'true' });
            setDetalle({ campo: data.detalle, valido: 'true' });
            setFechaIngreso({
                campo: data.fecha_ingreso?.split('T')[0],
                valido: 'true'
            });
        }
        setCargando(false);
    };

    // 2. CARGAR AUXILIARES (Para los combobox del formulario)
    const cargarAuxiliares = async ()=>  {
        const resClientes = await start(`${URL}ingresos/listar-clientes`);
        if (resClientes) setListaClientes(resClientes);
    };

    // 4. GUARDAR (CREAR O ACTUALIZAR)
    const handleGuardar = async (e, esEdicion = false) => {
        if (e) e.preventDefault();

        // alert(LOCAL_URL)
        const urlFinal = esEdicion ? 'actualizar' : 'crear';

        // No enviamos ID si es creación, el server usa randomUUID()
        // console.log(idIngreso.campo, ' campo id ingreso')

        const payload = {
            ...(esEdicion && { id: idIngreso.campo }),
            id_cliente: idCliente.campo,
            id_tramite: idTramite.campo,
            monto: monto.campo,
            tipo: tipo.campo,
            detalle: detalle.campo,
            fecha_ingreso: fechaIngreso.campo,
            created_at: new Date(), // Fecha de envío desde el nodo inicio
            updated_at: new Date(),
            datosAuditoriaExtra
        };

        return await saveDB(
            `${URL}ingresos/${urlFinal}`,
            payload,
            () => {
                // listarIngresos(idTramite.campo); 

                const rutaDestino = LOCAL_URL +'/listar-ingresos/' + idTramite.campo;

                // console.log(rutaDestino, '   ruta destino')
                setTimeout(() => {
                    navigate(rutaDestino);
                }, 1000);
            },
            setCargando
        );

    };


    const eliminarIngreso = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este ingreso?")) return;

        try {
            setCargando(true); // Iniciamos la carga desde el principio

            // 1. Obtenemos los datos necesarios para la lógica de eliminación/auditoría
            const res = await start(`${URL}ingresos/obtener`, { id });

            if (res && res.length > 0) {
                const data = res[0];

                // 2. Ejecutamos la eliminación enviando el contexto
                const res1 = await start(`${URL}ingresos/eliminar`, {
                    id,
                    monto: data.monto,
                    detalle: data.detalle,
                    tipo: data.tipo,
                    fecha: data.fecha_ingreso,
                    id_tramite: data.id_tramite // Lo extraemos para refrescar la lista luego
                }, 'Eliminando...');

                if (res1) {
                    // Éxito: Refrescamos la lista de ese trámite específico
                    listarIngresos(data.id_tramite);
                } else {
                    alert('No se pudo completar la eliminación en el servidor.');
                }
            } else {
                alert('No se encontró el registro original para eliminar.');
            }
        } catch (error) {
            console.error("Error en eliminarIngreso:", error);
            alert('Ocurrió un error inesperado.');
        } finally {
            setCargando(false); // Siempre quitamos el estado de carga al terminar
        }
    };

    // EXPORTAR PDF
    const exportPDfIngresos = async (output, row) => {
        // Generamos el PDF con el objeto 'row'}
        console.log("Iniciando exportación...", { output, row });

        const response = await ticketIngresoIndividual(output, { ingreso: row });
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

    };

    // 5. BUSCADORES
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = ingresos.filter(i =>
            i.codigo_tramite?.toLowerCase().includes(busqueda) ||
            i.detalle?.toLowerCase().includes(busqueda)
        );
        setIngresosFiltrados(filtrados);
    };


    return {
        ingresos, ingresosFiltrados, cargando,
        estados: { idTramite, monto, idCliente, tipo, detalle, fechaIngreso },
        setters: { setIdTramite, setMonto, setIdCliente, setTipo, setDetalle, setFechaIngreso },
        listarIngresos,
        listaClientes,
        cargarIngresoPorId,
        handleGuardar,
        eliminarIngreso,
        handleSearch,
        cargarAuxiliares,
        exportPDfIngresos,
        allListIngresos: () => setIngresosFiltrados(ingresos),
    };
};