import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { useClientes } from "../hooks/HookCustomCliente"; // Usamos el hook de clientes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faInfoCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';

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
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-11 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow-banking border-0 bg-white" style={{ borderRadius: '24px', overflow: 'hidden' }}>

                            <div className="p-4 text-center cabecera-formulario"> 
                                <h2 className="h4 fw-bold m-0 text-uppercase tracking-wider">
                                    {id ? 'Actualizar Ficha de Cliente' : 'Apertura de Registro'}
                                </h2>
                            </div>

                            <div className="p-4 p-md-5">
                                <form className="row g-4" onSubmit={(e) => guardarCliente(e, id ? id : null)}>

                                    <div className="col-12 mb-2">
                                        <span className="badge bg-light text-primary p-2 px-3 rounded-pill">
                                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                            Datos de Identidad
                                        </span>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="input-group-banking">
                                            <InputUsuarioStandard
                                                estado={estados.nombre} cambiarEstado={setters.setNombre}
                                                tipo='text' name='nombre' etiqueta='Nombre(s)'
                                                placeholder="Ej. Juan" ExpresionRegular={INPUT.NOMBRE}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <InputUsuarioStandard
                                            estado={estados.ap1} cambiarEstado={setters.setAp1}
                                            tipo='text' name='ap1' etiqueta='Primer Apellido'
                                            placeholder="Ej. Perez" ExpresionRegular={INPUT.NOMBRE}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputUsuarioStandard
                                            estado={estados.ap2} cambiarEstado={setters.setAp2}
                                            tipo='text' name='ap2' etiqueta='Segundo Apellido'
                                            placeholder="Opcional" ExpresionRegular={INPUT.NOMBRE}
                                            importante={false}
                                        />
                                    </div>
 
                                    <div className="col-md-6">
                                        <InputUsuarioStandard
                                            estado={estados.ci} cambiarEstado={setters.setCi}
                                            tipo='text' name='ci' etiqueta='C.I. / NIT'
                                            placeholder="Documento oficial" ExpresionRegular={INPUT.CI}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputUsuarioStandard
                                            estado={estados.celular} cambiarEstado={setters.setCelular}
                                            tipo='text' name='celular' etiqueta='Teléfono de Contacto'
                                            placeholder="7XXXXXXX" ExpresionRegular={INPUT.TELEFONO}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <InputUsuarioStandard
                                            estado={estados.direccion} cambiarEstado={setters.setDireccion}
                                            tipo='text' name='direccion' etiqueta='Dirección Domiciliaria'
                                            placeholder="Calle, Número, Zona" ExpresionRegular={INPUT.DIRECCION}
                                        />
                                    </div>

                                    {/* Acciones Finales */}
                                    <div className="col-12 d-flex flex-column flex-md-row justify-content-end gap-3 mt-5 pt-4 border-top">
                                        <button
                                            type="button"
                                            className="btn btn-banking-cancel order-2 order-md-1"
                                            onClick={() => window.history.back()}
                                        >
                                            CANCELAR
                                        </button>
                                        <button
                                            type="submit"
                                            className={`btn ${id ? 'btn-banking-blue' : 'btn-banking-gold'} order-1 order-md-2 px-5`}
                                        >
                                            {/* <FontAwesomeIcon icon={faCheckCircle} className="me-2" /> */}
                                            <span>              {id ? 'ACTUALIZAR' : ' REGISTRAR'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default NuevoCliente;