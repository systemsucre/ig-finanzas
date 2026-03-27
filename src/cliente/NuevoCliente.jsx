import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { useClientes } from "../hooks/HookCustomCliente"; // Usamos el hook de clientes

const NuevoCliente = () => {
    const { id } = useParams();

    // 1. Extraemos lógica del Hook de Clientes
    const {
        estados,
        setters,
        guardarCliente,
        clientesFiltrados
    } = useClientes();

    const {
        setNombre, setAp1, setAp2, setCi,
        setCelular, setDireccion, setEstado
    } = setters;

    // 2. Efecto para cargar datos en modo Edición
    useEffect(() => {
        if (id && clientesFiltrados.length > 0) {
            const cliente = clientesFiltrados.find(c => c.id === parseInt(id));
            if (cliente) {
                setNombre({ campo: cliente.nombre, valido: 'true' });
                setAp1({ campo: cliente.ap1, valido: 'true' });
                setAp2({ campo: cliente.ap2 || '', valido: 'true' });
                setCi({ campo: cliente.ci, valido: 'true' });
                setCelular({ campo: cliente.celular || '', valido: 'true' });
                setDireccion({ campo: cliente.direccion || '', valido: 'true' });
                setEstado({ campo: cliente.estado, valido: 'true' });
            }
        }
    }, [id, clientesFiltrados, setNombre, setAp1, setAp2, setCi, setCelular, setDireccion, setEstado]);

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-11 col-lg-9 col-xl-8 animate-fade-in">
                        <div className="login-card shadow-clinical p-4 p-md-5 bg-white" style={{   borderTop: `10px solid  #0d6efd` }} >

                            {/* Encabezado Dinámico */}
                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">{id ? '📝' : '🤝'}</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">
                                    {id ? 'Actualizar Cliente' : 'Registro de Cliente'}
                                </h2>
                            </div>

                            <form className="row g-3" onSubmit={(e) => guardarCliente(e, id ? id : null)}>

                                {/* Sección de Datos Personales */}
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.nombre} cambiarEstado={setters.setNombre}
                                        tipo='text' name='nombre' etiqueta='Nombre *'
                                        placeholder="Ej. Juan" ExpresionRegular={INPUT.NOMBRE}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.ap1} cambiarEstado={setters.setAp1}
                                        tipo='text' name='ap1' etiqueta='Primer Apellido *'
                                        placeholder="Ej. Perez" ExpresionRegular={INPUT.NOMBRE}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.ap2} cambiarEstado={setters.setAp2}
                                        tipo='text' name='ap2' etiqueta='Segundo Apellido'
                                        placeholder="Ej. Gomez" ExpresionRegular={INPUT.NOMBRE}
                                        importante = {false}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.ci} cambiarEstado={setters.setCi}
                                        tipo='text' name='ci' etiqueta='C.I. / NIT *'
                                        placeholder="1234567" ExpresionRegular={INPUT.CI}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.celular} cambiarEstado={setters.setCelular}
                                        tipo='text' name='celular' etiqueta='Teléfono / Celular *'
                                        placeholder="70000000" ExpresionRegular={INPUT.TELEFONO}
                                    />
                                </div>

                                <div className="col-12">
                                    <InputUsuarioStandard
                                        estado={estados.direccion} cambiarEstado={setters.setDireccion}
                                        tipo='text' name='direccion' etiqueta='Dirección de Domicilio *'
                                        placeholder="Av. Principal #123" ExpresionRegular={INPUT.DIRECCION}
                                    />
                                </div>

                                {/* Botones de Acción */}
                                <div className="col-12 p-3 text-end mt-4">
                                    <hr />
                                    <button type="submit" className={`btn ${id ? ` btn-info` : ` btn-success`} px-5 py-2 fw-bold shadow-sm`}>
                                        {id ? 'GUARDAR CAMBIOS' : 'REGISTRAR CLIENTE'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default NuevoCliente;