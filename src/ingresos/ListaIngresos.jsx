import {
  faFilePdf,
  faPlus,
  faEdit,
  faTrash,
  faHandHoldingUsd,
  faArrowLeft,
  faRotateLeft,
  faPlusCircle,
  faSearch,
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

export function ListaIngresosTramite() {
  const navigate = useNavigate();

  const {
    ingresosFiltrados,
    cargando,
    handleSearch,
    listarIngresosDirectos, // Cambiado de listarSalidas
    handleRevertirPagoPendientes,
    eliminarIngreso,
    exportPDfIngresos,
  } = UseCustomIngresos();

  const { tramitesFiltradosBoleta } = useTramites();

  useEffect(() => {
    listarIngresosDirectos();
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
            if (row.tipo_ingreso === 1) {
              // Caso: Editar
              navigate(
                `${LOCAL_URL}/cajero/editar-ingreso-directo/${id_ingreso}`,
              );
            } else {
              // Caso: Revertir
              const confirmacion = window.confirm(
                '¿REVERTIR ESTE PAGO?\nSU PAGO QUEDARÁ NUEVAMENTE PENDIENTE EN LA VENTANA DE PAGOS PENDIENTES',
              );

              if (confirmacion) {
                handleRevertirPagoPendientes(id_ingreso, row.id_tramite);
              }
            }
          },
          className: (id, row) => {
            return ` btn ${row.tipo_ingreso === 1 ? ' btn-info mr-int' : 'btn-warning mr'} py-1 px-3 x-small me-1 `;
          },
          icono: (id, row) => {
            return row.tipo_ingreso === 1 ? faEdit : faRotateLeft;
          },
          label: (id, row) => {
            return row.tipo_ingreso === 1 ? 'Editar' : '';
          },
        },
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
        {
          boton: (id_ingreso) => eliminarIngreso(id_ingreso, 1),
          className: 'btn btn-danger py-1 px-3 x-small mr-int',
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
          className: 'btn btn-pdf py-1 px-3 x-small me-1 mr-int',
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
              <h3 className="banco-title-main">Ingresos Liquidados</h3>
              <p className="banco-subtitle">Ingreso de todos los trámites</p>
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
