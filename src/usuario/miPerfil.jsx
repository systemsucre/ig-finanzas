import { faInfoCircle, faTrashAlt, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { INPUT, LOCAL_URL } from "../Auth/config";
import { ComponenteInputUserDisabled, InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { useMiPerfil } from "../hooks/HookCustomMiPerfil";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { columnsSesiones } from "./sesionTable";

const MiPerfil = () => {
    const navigate = useNavigate()

    // 2. Extraemos el objeto setters del Hook
    const {
        estados,
        setters,
        actualizar,
        sessiones,
        eliminarSesion,
    } = useMiPerfil();

    return (
        <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
            <div className="panel-custom  rounded shadow-sm mx-2">

                <div className="banco-header-section">
                    <h3 className="banco-title-main">Mis datos de perfil</h3>

                </div>

                <div className="row g-3 mt-3" style={{ background: 'white', padding: '1rem' }}>
                    <div className="col-12 mb-2">
                        <span className="badge bg-light text-primary p-2 px-3 rounded-pill">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            Información Personal
                        </span>
                    </div>
                    {/* Datos Personales */}
                    <div className="col-md-4">
                        <InputUsuarioStandard
                            estado={estados.nombre}
                            tipo='text' name='nombre' etiqueta='Nombre '
                            placeholder="Ej. Juan" ExpresionRegular={INPUT.NOMBRE}
                        />
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
                            placeholder="Ej. Gomez" ExpresionRegular={INPUT.NOMBRE}
                            importante={false}
                        />
                    </div>

                    <div className="col-md-4">
                        <InputUsuarioStandard
                            estado={estados.ci} cambiarEstado={setters.setCi}
                            tipo='text' name='ci' etiqueta='C.I.'
                            placeholder="1234567" ExpresionRegular={INPUT.CI}
                        />
                    </div>
                    <div className="col-md-4">
                        <InputUsuarioStandard
                            estado={estados.celular} cambiarEstado={setters.setCelular}
                            tipo='text' name='celular' etiqueta='Celular'
                            placeholder="70000000" ExpresionRegular={INPUT.TELEFONO}
                        />
                    </div>


                    <div className="col-md-4">
                        <ComponenteInputUserDisabled
                            estado={estados.idRol}
                            tipo='text' name='celular' etiqueta='Rol'
                            placeholder="70000000"
                        />
                    </div>

                    <div className="col-12">
                        <InputUsuarioStandard
                            estado={estados.direccion} cambiarEstado={setters.setDireccion}
                            tipo='text' name='direccion' etiqueta='Dirección'
                            placeholder="Av. Siempre Viva #123" ExpresionRegular={INPUT.DIRECCION}
                        />
                    </div>
                    <div className="col-12 p-3 text-end">
                        <button type="submit" className={`btn ${` btn-success`} px-5 py-2 fw-bold shadow-sm`} onClick={(e) => actualizar(e)}>
                            {'ACTUALIZAR '}
                        </button>
                        <button type="submit" className={`btn ${` btn-danger`} px-5 py-2 fw-bold shadow-sm`} style={{ marginLeft: '5px' }} onClick={(e) => navigate(`${LOCAL_URL + '/c-pass'}`)} >
                            <FontAwesomeIcon icon={faUnlock} />
                        </button>
                    </div>
                </div>

                <div className="row g-3 mt-3" style={{ background: 'white', padding: '1rem' }}>
                    <div className="col-12 mb-2">
                        <span className="badge bg-light text-primary p-2 px-3 rounded-pill">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            Sesiones y Seguridad
                        </span>
                    </div>
                    {/* Datos Personales */}
                    <DataTable
                        columns={columnsSesiones}
                        data={sessiones}
                        // progressPending={}
                        funciones={[

                            {
                                // Lógica dinámica para el botón de estado
                                boton: (id, row) => eliminarSesion(id),
                                className: 'btn btn-danger py-1 px-3 x-small',
                                icono: faTrashAlt,
                                label: '',
                                enlace: null
                            }
                        ]}
                    />

                </div>
            </div>
        </main>
    );
};

export default MiPerfil;