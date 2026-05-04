import {
  faFileInvoiceDollar,
  faFilePdf,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'; // Icono más acorde a gastos/salidas
import DataTable from '../components/DataTable';
import { InputUsuarioSearch } from '../components/input/elementos';
import { ColumnsTableTramites } from './columnTableTramites';
import { useTramites } from '../hooks/HookCustomTramites';
import { LOCAL_URL } from '../Auth/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export function Movimientos() {
  const {
    handleSearch,
    tramites,
    tramitesFiltrados,
    allList,
    filterByEstado,
    cargando,
    filterByDelete,
    exportPDfTramites,
  } = useTramites();
  const enCurso = tramites.filter((t) => t.estado === 1).length;
  const paralizados = tramites.filter((t) => t.estado === 2).length;
  const finalizados = tramites.filter((t) => t.estado === 3).length;
  const [tabActivo, setTabActivo] = useState('todos');
  return (
    <>
      <main className="container-xl mt-5" style={{ maxWidth: '100%' }}>

        <div className="banco-header-section mb-4">
          <div className="banco-title-container">
            <h3 className="banco-title-main">Ver Movimientos</h3>
            <p className="banco-subtitle">Revisa los movimientos registrados</p>
          </div>
        </div>

        <div className="panel-custom  rounded shadow-sm mx-2">
          <div className="banco-filter-row">

            <div className="banco-tabs-container">
              <button
                className={`banco-tab-item ${tabActivo === 'todos' ? 'active' : ''}`}
                onClick={() => {
                  allList();
                  setTabActivo('todos');
                }}
              >
                Todos<span className="banco-tab-count">({tramites.length})</span>
              </button>
              <button
                className={`banco-tab-item ${tabActivo === 'en-curso' ? 'active' : ''}`}
                onClick={() => {
                  filterByEstado(1);
                  setTabActivo('en-curso');
                }}
              >
                EN CURSO <span className="banco-tab-count">({enCurso})</span>
              </button>
              <button
                className={`banco-tab-item ${tabActivo === 'paralizados' ? 'active' : ''}`}
                onClick={() => {
                  filterByEstado(0);
                  setTabActivo('paralizados');
                }}
              >
                PARALIZADOS <span className="banco-tab-count">({paralizados})</span>
              </button>
              <button
                className={`banco-tab-item ${tabActivo === 'finalizados' ? 'active' : ''}`}
                onClick={() => {
                  filterByEstado(3);
                  setTabActivo('finalizados');
                }}
              >
                FINALIZADOS <span className="banco-tab-count">({finalizados})</span>
              </button>

              {tramites.filter((t) => t.eliminado == 0).length > 0 && (
                <button
                  className={`banco-tab-item ${tabActivo === 'eliminados' ? 'active' : ''}`}
                  onClick={() => {
                    filterByDelete(0)
                    setTabActivo('eliminados');

                  }}
                >
                  RECICLAJE (
                  <span className="banco-tab-count">
                    {tramites.filter((t) => t.eliminado == 0).length}
                  </span>
                  )
                </button>
              )}
            </div>

            <div className="banco-search-wrapper">
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
                               placeholder="Buscar por codigo o numero"

                onChange={handleSearch}
                className="banco-input-search"
              />
            </div>
          </div>

          <div className="table-responsive">
            <DataTable
              columns={ColumnsTableTramites}
              data={tramitesFiltrados}
              cargando={cargando}
              funciones={[
                {
                  boton: null,
                  // Cambiamos a btn-success o btn-dark para diferenciarlo de "Editar"
                  className: 'btn btn-success py-1 px-3 x-small me-1 mr-int',
                  icono: faFileInvoiceDollar, // Nuevo icono de factura/dinero
                  // Cambiamos la ruta a la lista de salidas
                  enlace: LOCAL_URL + '/listar-salidas',
                  label: 'Ver Gastos',
                },
                {
                  boton: null,
                  // Cambiamos a btn-success o btn-dark para diferenciarlo de "Editar"
                  className: 'btn btn-info py-1 px-3 x-small me-1 ml-2 mr-int',
                  icono: faFileInvoiceDollar, // Nuevo icono de factura/dinero
                  // Cambiamos la ruta a la lista de salidas
                  enlace: LOCAL_URL + '/listar-ingresos-por-movimiento',
                  label: 'Ver ingresos',
                },
                {
                  boton: (id_salida, row) => {
                    exportPDfTramites(
                      window.innerWidth < 1100 ? 'b64' : 'print',
                      row,
                    );
                  },
                  className: 'btn btn-secondary py-1 px-3 x-small',
                  icono: faFilePdf,
                  label: 'PDF',
                },
              ]}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default Movimientos;
