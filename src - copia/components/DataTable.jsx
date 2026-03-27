import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'

const DataTable = ({ columns, data, funciones }) => {
    return (
        <div className="  table-container animate-fade-up">

            <div className="table-responsive-wrapper"> {/* El que hace el scroll */}
                <table className="table-responsive-custom">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.field}>{col.label}</th>
                            ))}
                            <th className="text-center">Acciones</th>
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
                                <td>
                                    <div className="contenedor-botones">
                                        {/* {funciones.map((f, index) => (
                                            !f.enlace ?
                                                <button
                                                    key={index}
                                                    onClick={() => f.boton(item.id)}
                                                    className={f.className}
                                                >
                                                   <FontAwesomeIcon icon={f.icono} />{f.label} 
                                                </button>
                                                : <Link key={index} className={f.className} to={`${f.enlace}/${item.id}`} > <FontAwesomeIcon icon={f.icono} /> {f.label} </Link>

                                        ))} */}
                                        {funciones.map((f, index) => {
                                            // Resolvemos los valores dinámicos ejecutando la función si es necesario
                                            const className = typeof f.className === 'function' ? f.className(item.id, item) : f.className;
                                            const icono = typeof f.icono === 'function' ? f.icono(item.id, item) : f.icono;
                                            const label = typeof f.label === 'function' ? f.label(item.id, item) : f.label;

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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default DataTable;