import {
  faFilePdf,
  faPlus,
  faEdit,
  faTrash,
  faHandHoldingUsd,
  faArrowLeft,
  faRotateLeft,
  faSearch,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from '../components/DataTable';
import { InputUsuarioSearch } from '../components/input/elementos';
import { UseCustomIngresos } from '../hooks/HookCustomIngresosCajero'; // Hook adaptado previamente
import { useTramites } from '../hooks/HookCustomTramites'; // Hook adaptado previamente
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ColumnsTableIngresos } from './columnTableIngresos'; // Columnas adaptadas previamente
import { LOCAL_URL } from '../Auth/config';


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ListaIngresosVista() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    ingresosFiltrados,
    cargando,
    handleSearch,
    listarIngresosDirectos, // Cambiado de listarSalidas
    exportPDfIngresos,
  } = UseCustomIngresos();

  const { tramitesFiltradosBoleta } = useTramites();

  useEffect(() => {
    if (id) {
      if (!UUID_REGEX.test(id)) {
        navigate(LOCAL_URL + "/movimientos");
        return;
      }
      listarIngresosDirectos(id);
    }
  }, [id]);

  // Cálculo de totales para el resumen
  const totalRecaudado = ingresosFiltrados.reduce(
    (acc, curr) => acc + Number(curr.monto || 0),
    0,
  );

  const funciones =
    [
      {
        boton: (id_salida, row) => {
          exportPDfIngresos(
            window.innerWidth < 1100 ? 'b64' : 'print',
            row,
          );
        },
        className: 'btn btn-pdf py-1 px-3 x-small me-1 mr-int',
        icono: faFilePdf,
        label: 'Recibo',
      },
    ];

  return (
    <>
      <main className="container-xl mt-2" style={{ maxWidth: '100%' }}>

        <div className="panel-custom  rounded shadow-sm  mx-2" >

          <div className="banco-header-section mb-4">
            <div className="banco-title-container">
              <h3 className="banco-title-main">Ingresos Liquidados</h3>
              <p className="banco-subtitle">Dale un vistazo a tus ingresos</p>
            </div>
          </div>
          <div className="banco-nav-header">
            <button className="banco-btn-back" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h1 className="banco-nav-title">Ver movimientos</h1>
          </div>
          <div className="banco-search-wrapper p-2" >
            {/* Icono de lupa posicionado absolutamente dentro del wrapper */}
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8e8e93',
                zIndex: 1
              }}
            />
            <input
              name="search-boleta"
              placeholder="Buscar abono o detalle..."
              onChange={handleSearch}
              className="banco-input-search"
            />
          </div>






          <div className="table-responsive">
            <DataTable
              columns={ColumnsTableIngresos}
              data={ingresosFiltrados}
              cargando={cargando}
              funciones={funciones}
            />
          </div>
        </div>
      </main>
    </>
  );
}
