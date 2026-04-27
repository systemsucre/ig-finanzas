import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const DataTable = ({ columns, data, funciones }) => {
  return (
    <div className="  table-container animate-fade-up">
      <div className="table-responsive-wrapper">
        {' '}
        {/* El que hace el scroll */}
        <table className="table-responsive-custom">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.field}>{col.label}</th>
              ))}
              {funciones.length > 0 ? (
                <th className="text-center">Acciones</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.field} data-label={col.label}>
                    {col.render ? col.render(item) : item[col.field]}
                  </td>
                ))}
                {funciones.length > 0 ? (
                  <td>
                    <div
                      className="contenedor-botones"
                      style={{ display: 'flex', gap: '5px' }}
                    >
                      {funciones.map((f, index) => {
                        // Resolvemos los valores dinámicos ejecutando la función si es necesario
                        const className =
                          typeof f.className === 'function'
                            ? f.className(item.id, item)
                            : f.className;
                        const icono =
                          typeof f.icono === 'function'
                            ? f.icono(item.id, item)
                            : f.icono;
                        const label =
                          typeof f.label === 'function'
                            ? f.label(item.id, item)
                            : f.label;

                        return !f.enlace ? (
                          <button
                            key={index}
                            // Importante: pasar item.id y el estado (o el item completo) al hacer click
                            onClick={() => f.boton(item.id, item)}
                            className={className}
                          >
                            <FontAwesomeIcon icon={icono} /> {label}
                          </button>
                        ) : (
                          <Link
                            key={index}
                            className={className}
                            to={`${f.enlace}/${item.id}`}
                          >
                            <FontAwesomeIcon icon={icono} /> {label}
                          </Link>
                        );
                      })}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
