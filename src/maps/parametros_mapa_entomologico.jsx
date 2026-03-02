import { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import { start } from '../service/service';
import { Select1Easy } from '../components/input/elementos';
import { ContenedorCheck } from '../components/input/stylos';
import { URL } from '../Auth/config';


function ParametroMapsEntomologico() {

    const [level, setLevel] = useState(null)
    const [option, setOption] = useState([{ campo: null, valido: null }])
    const [option1, setOption1] = useState([{ campo: null, valido: null }])

    const [listEntity, setListEntity] = useState([])
    const [listComunidad, setListComunidad] = useState([])


    return (
        <div className="contentSimple"  >
            <div className="main-container ">
                <div className='contenedor-parametros-mapas'>   
                    <Row>
                        <Col md={12} className='mb-5'>
                            <p className='titulo-parametros-mapa'>
                                PARAMETROS DE GENERACION MAPA ENTOMOLOGICO
                            </p>
                        </Col>
                        <Col md={3}>
                            <ContenedorCheck>
                                <label htmlFor={'level-consolidado'}>
                                    <span>{'CONSOLIDADO '}</span>
                                    <input type="radio" id={'level-consolidado'} name='level' style={{ marginLeft: '5px', marginTop: '10px' }}
                                        onChange={async () => {
                                            setLevel(1)
                                            setListEntity([{ value: 1, label: 'CONSOLIDADO' }])
                                            setOption({ campo: 1, valido: 'true' })
                                        }}
                                        defaultChecked={false}
                                    />
                                </label>
                            </ContenedorCheck>
                        </Col>
                        <Col md={3}>

                            <ContenedorCheck>
                                <label htmlFor={'level-red'}>
                                    <span>{'REDES DE SALUD'}</span>
                                    <input type="radio" id={'level-red'} name='level' style={{ marginLeft: '5px', marginTop: '10px' }}
                                        onChange={async () => {
                                            setLevel(2)
                                            const data = await start(URL + 'public-map/list-redes')
                                            setListEntity(data[0])
                                        }}
                                        defaultChecked={false}
                                    />
                                </label>
                            </ContenedorCheck>
                        </Col>

                        <Col md={3}>
                            <ContenedorCheck>
                                <label htmlFor={'level-municipio'}>
                                    <span>{'MUNICIPIO'}</span>
                                    <input type="radio" id={'level-municipio'} name='level' style={{ marginLeft: '5px', marginTop: '10px' }}
                                        onChange={async () => {
                                            setLevel(3)
                                            const data = await start(URL + 'public-map/list-municipios')
                                            setListEntity(data[0])
                                        }}
                                        defaultChecked={false}
                                    />
                                </label>
                            </ContenedorCheck>
                        </Col>


                        <Col md={3}>
                            <ContenedorCheck>
                                <label htmlFor={'level-municipio-comunidad'}>
                                    <span>{'MUNICIPIO Y COMUNIDAD'}</span>
                                    <input type="radio" id={'level-municipio-comunidad'} name='level' style={{ marginLeft: '5px', marginTop: '10px' }}
                                        onChange={async () => {
                                            setLevel(4)
                                            const data = await start(URL + 'public-map/list-municipios')
                                            setListEntity(data[0])
                                        }}
                                        defaultChecked={false}
                                    />
                                </label>
                            </ContenedorCheck>
                        </Col>

                        <Col md={3}>
                            <ContenedorCheck>
                                <label htmlFor={'level-comunidad'}>
                                    <span>{'COMUNIDAD'}</span>
                                    <input type="radio" id={'level-comunidad'} name='level' style={{ marginLeft: '5px', marginTop: '10px' }}
                                        onChange={async () => {
                                            setLevel(5)
                                            const data = await start(URL + 'public-map/list-comunidades')
                                            setListEntity(data[0])
                                        }}
                                        defaultChecked={false}
                                    />
                                </label>
                            </ContenedorCheck>
                        </Col>

                        <Col md={12} className='mt-2'>

                            { level === 2 || level === 3 || level === 5 || level === 4?
                                <Select1Easy
                                    estado={option}
                                    cambiarEstado={setOption}
                                    name={'entidad'}
                                    lista={listEntity}
                                    etiqueta={level == 2 ? 'Red de Salud' : level === 3 ? 'Municipio' : level === 5 ? 'Comunidad' : level === 4 ? 'Municipio' : null}
                                    msg='Seleccione una opcion'
                                    funcion={async (e) => {

                                        if (level === 4) {
                                            setListComunidad([])
                                            setLevel(4)
                                            const data = await start(URL + 'public-map/list-comunidades-municipio', { municipio: e })
                                            setListComunidad(data[0])
                                        }

                                    }}
                                /> : null}

                            {
                                level === 4 ?
                                    <Select1Easy
                                        estado={option1}
                                        cambiarEstado={setOption1}
                                        name={'Comunidad'}
                                        lista={listComunidad}
                                        etiqueta={'Comunidad'}
                                        msg='Seleccione una opcion'

                                    />
                                    : null}
                        </Col>


                        <Col md={12} style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: '40px'
                        }}>

                            {(!option.campo ) || !level ?
                                <Button disabled className='filter-btn' >
                                    Generar mapa
                                </Button> :
                                <Link
                                    to={`/smd/generar-mapa-entomologico/${level === 4?option1.campo: option.campo}/${level}`}
                                    // to="/mapa-entomologico"
                                    className='filter-btn' >
                                    Generar mapa
                                </Link>
                            }

                        </Col>

                        <Col md={12}>

                            <p className='text-center'>
                                {level && 'generación de mapas'} <span style={{ fontWeight: '600' }}>{
                                    level === 1 ? ' CONSOLIDADO' : level === 2 ? ' por RED DE SALUD' : level === 3 ? ' por MUNICIPIO' : level === 4 ? ' por COMUNIDAD' : 'seleccione parametros'
                                }
                                </span>
                            </p>
                        </Col>

                    </Row>
                </div>


            </div>
        </div >
    );
}

export default ParametroMapsEntomologico;