import {
  faFilePdf,
  faPlus,
  faEdit,
  faTrash,
  faHandHoldingUsd,
  faArrowLeft,
  faCoins,
  faSackDollar,
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
          {
            boton: (id_ingreso, row) => {
              navigate(
                `${LOCAL_URL}/cajero/editar-ingreso-pendiente/${id_ingreso}`,
              );
            },
            className: 'btn btn-orange py-1 px-3 x-small me-1 mr-int',
            icono: faCoins,
            label: '',
          },

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
      <main className="container-xl mt-2" style={{ maxWidth: '100%' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 m-2">
          <div>
            <h3
              className="text-dark fw-bold mb-0 text-titulos"
              style={{ marginLeft: '5px', marginTop: '7rem' }}
            >
              PAGOS PENDIENTES
            </h3>
            <p
              className="text-muted mb-0 small text-uppercase"
              style={{
                letterSpacing: '1px',
                fontSize: '0.7rem',
                color: 'white',
                marginLeft: '5px',
              }}
            >
              Gestión Financiera - Control de Pagos pendientes por Caja
            </p>
          </div>
        </div>

        <div
          className=" d-flex justify-content-end gap-2 "
          style={{ marginRight: '10px' }}
        >
          {/* El botón nuevo gasto hereda el UUID correctamente */}
          {parseInt(localStorage.getItem('numRol')) === 3 ? (
            <>
              <button
                className="btn btn-success  fw-bold"
                onClick={() =>
                  navigate(LOCAL_URL + `/cajero/nuevo-ingreso-pendiente/`)
                }
                disabled={
                  !tramitesFiltradosBoleta ||
                  !tramitesFiltradosBoleta.length === 0
                }
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" /> REGISTRAR
              </button>
              <button
                className=" btn btn-dark"
                style={{ marginLeft: '4px' }}
                onClick={() => {
                  navigate(LOCAL_URL + '/cajero/ingresos-pendientes');
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> VOLVER
              </button>
            </>
          ) : null}
        </div>

        <div className="panel-custom bg-white rounded shadow-sm p-2 mx-2">
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-6 d-flex justify-content-end">
              <div style={{ width: '280px' }}>
                <InputUsuarioSearch
                  name="input-search-ingreso"
                  placeholder="Buscar abono o detalle..."
                  onChange={handleSearch}
                />
              </div>
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
