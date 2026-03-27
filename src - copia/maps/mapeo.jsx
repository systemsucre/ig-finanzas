
import {
  Row,
} from 'reactstrap';
import { Link } from 'react-router-dom';


import './style.css';

export default function Mapeo() {


  return (
    <div className="contentSimple"  >
      <div className="main-container">
        <div className='contenedor-parametros-mapas'>
          <p className='titulo-parametros-mapa'>
            SELECCIONE TIPO DE MAPA
          </p>
          <div
            style={{ height: '80vh' }}>
            <div style={{ position: 'relative', top: '25vh' }}>

              <p className='mb-5 text-center' style={{ color: "#fd5d93", fontWeight: '600' }} >Presione en una opcion</p>
              <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Link to={'/smd/eleccion-tipo-mapa-entologico'} className='botonMainMaps' style={{ background: '#00AEA4 ' }}>
                  Mapa Entomologico
                </Link>
                <Link to={'/smd/eleccion-tipo-mapa-estratificado'} className='botonMainMaps' style={{ background: '#fd5d93' }}>
                  Mapa Estratificado
                </Link>

              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}