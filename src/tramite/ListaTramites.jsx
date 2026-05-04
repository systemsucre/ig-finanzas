import {
  faEdit,
  faTrashAlt,
  faRecycle,
  faFilePdf,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import DataTable from '../components/DataTable';
import { InputUsuarioSearch } from '../components/input/elementos';
import { ColumnsTableTramites } from './columnTableTramites';
import { useTramites as UseTramites } from '../hooks/HookCustomTramites'; // Asegúrate que el path sea correcto
import { LOCAL_URL } from '../Auth/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export function ListaTramites() {
  // Extraemos las funciones y estados del custom hook
  const {
    handleSearch,
    tramites,
    tramitesFiltrados,
    allList,
    filterByEstado,
    cargando,
    eliminarTramite,
    filterByDelete,
    exportPDfTramites,
  } = UseTramites();

  // Cálculos para las estadísticas (Cards)
  const enCurso = tramites.filter((t) => t.estado === 1).length;
  const paralizados = tramites.filter((t) => t.estado === 2).length;
  const finalizados = tramites.filter((t) => t.estado === 3).length;
  const [tabActivo, setTabActivo] = useState ('todos');

  return (
    <>
      <main className="container-xl mt-5" style={{ maxWidth: '100%' }}>
        <div className="banco-header-section mb-4">
          <div className="banco-title-container">
            <h3 className="banco-title-main">Gestion de Cajas</h3>
            <p className="banco-subtitle">Gestiona Tus cajas desde aqui</p>
          </div>
        </div>


        <div className="panel-custom  rounded shadow-sm  mx-2">
          {/* BARRA DE ACCIONES: Filtros y Buscador */}
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

          {/* Tabla de Datos */}
          <div className="table-responsive">
            <DataTable
              columns={ColumnsTableTramites}
              data={tramitesFiltrados}
              cargando={cargando}
              funciones={[
                {
                  boton: null,
                  className: 'btn btn-info py-1 px-3 x-small me-1 mr-int',
                  icono: faEdit,
                  enlace: (() => {
                    const rol = parseInt(localStorage.getItem('numRol'));
                    let base = '';
                    if (rol === 1) base = '/admin';
                    else if (rol === 2) base = '/gerente';
                    else if (rol === 3) base = '/cajero';

                    return `${LOCAL_URL}${base}/editar-caja`;
                  })(),
                  label: 'Editar',
                },

                {
                  boton: (id, row) =>
                    eliminarTramite(id, row.eliminado === 1 ? 0 : 1), // Ejemplo para paralizar/activar
                  className: (id, row) =>
                    row.eliminado === 1
                      ? 'btn btn-danger py-1 px-3 x-small mr-int'
                      : 'btn btn-warning py-1 px-3 x-small mr-int',
                  icono: (id, row) =>
                    row.eliminado === 1 ? faTrashAlt : faRecycle,
                  enlace: null,
                  label: (id, row) =>
                    row.eliminado === 1 ? 'Eliminar' : 'Restaurar',
                },

                {
                  boton: (id_salida, row) => {
                    exportPDfTramites(
                      window.innerWidth < 1100 ? 'b64' : 'print',
                      row,
                    );
                  },

                  className: 'btn btn-secondary py-1 px-3 x-small ',
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

export default ListaTramites;
