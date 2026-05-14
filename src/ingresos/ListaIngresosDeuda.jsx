import {
  faFilePdf,
  faPlus,
  faEdit,
  faTrash,
  faHandHoldingUsd,
  faArrowLeft,
  faCoins,
  faSackDollar,
  faPlusCircle,
  faSearch,
  // fa-circle-half-stroke
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from '../components/DataTable';
import { InputUsuarioSearch } from '../components/input/elementos';
import { UseCustomIngresos } from '../hooks/HookCustomIngresosCajero'; // Hook adaptado previamente
import { useTramites } from '../hooks/HookCustomTramites'; // Hook adaptado previamente
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ColumnsTableIngresos } from './columnTableIngresos'; // Columnas adaptadas previamente
import { LOCAL_URL } from '../Auth/config';
import { ColumnsTableIngresosPendientes } from './columnTableIngresosPendientes';

export function ListaIngresosDeuda() {
  const navigate = useNavigate();

  const {
    ingresosFiltrados,
    cargando,
    handleSearch,
    listarIngresosPendientes, // Cambiado de listarSalidas
    eliminarIngreso,
    exportPDfIngresos,
  } = UseCustomIngresos();

  const { tramitesFiltradosBoleta } = useTramites();

  useEffect(() => {
    listarIngresosPendientes();
  }, []);

  // Cálculo de totales para el resumen
  const totalRecaudado = ingresosFiltrados.reduce(
    (acc, curr) => acc + Number(curr.monto || 0),
    0,
  );

  const funciones =
    parseInt(localStorage.getItem('numRol')) === 3
      ? [

        //INGRESO CANCELADOS POR LOTES
        // {
        //   boton: (id_ingreso, row) => {
        //     navigate(
        //       `${LOCAL_URL}/cajero/editar-ingreso-pendiente/${id_ingreso}`,
        //     );
        //   },
        //   className: 'btn btn-orange py-1 px-3 x-small me-1 mr-int',
        //   icono: faCoins,
        //   label: '',
        // },

        {
          boton: (id_ingreso, row) => {
            navigate(`${LOCAL_URL}/cajero/completar-pago/${id_ingreso}`);
          },
          className: 'btn btn-success py-1 px-3 x-small me-1 mr',
          icono: faSackDollar,
          label: '',
        },
        {
          boton: (id_ingreso, row) => {
            navigate(
              `${LOCAL_URL}/cajero/editar-ingreso-pendiente/${id_ingreso}`,
            );
          },
          className: 'btn btn-info py-1 px-3 x-small me-1',
          icono: faEdit,
          label: 'Editar',
        },
        // {
        //   boton: (id_salida, row) => {
        //     exportPDfIngresos(
        //       window.innerWidth < 1100 ? 'b64' : 'print',
        //       row,
        //     );
        //   },
        //   className: 'btn btn-pdf py-1 px-3 x-small me-1',
        //   icono: faFilePdf,
        //   label: 'Recibo',
        // },
        {
          boton: (id_ingreso) => eliminarIngreso(id_ingreso, 2),
          className: 'btn btn-danger py-1 px-3 x-small',
          icono: faTrash,
          label: 'Eliminar',
        },
      ]
      : [
        {
          boton: (id_salida, row) => {
            exportPDfIngresos(
              window.innerWidth < 1100 ? 'b64' : 'print',
              row,
            );
          },
          className: 'btn btn-pdf py-1 px-3 x-small me-1',
          icono: faFilePdf,
          label: 'Recibo',
        },
      ];

  return (
    <>
      <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
        <div className="panel-custom rounded shadow-sm mx-2">
          <div className="banco-header-section">
            <div className="banco-title-container">
              <h3 className="banco-title-main">Ingresos Pendientes </h3>
              <p className="banco-subtitle">Ingreso pendientes de todos los trámites</p>
            </div>
          </div>

          <div className="banco-search-wrapper p-2">
            <div className="banco-search-wrapper">
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
                name="input-search-salida"
                placeholder="caja, Cliente..."
                onChange={handleSearch}
                className="banco-input-search"
              />
            </div>
          </div>

          <div className="table-responsive">
            <DataTable
              columns={ColumnsTableIngresosPendientes}
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
