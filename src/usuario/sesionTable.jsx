import { 
    faCheckCircle, 
    faXmarkCircle, 
    faDesktop, 
    faGlobe, 
    faNetworkWired,
    faWindowRestore
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const columnsSesiones = [
    {
        label: 'Fecha y Hora',
        field: 'fecha',
        render: row => (
            <div className="flex flex-col">
                <span className="td-descripcion font-bold">
                    {new Date(row.fecha).toLocaleDateString('es-BO')}
                </span>
                <span className="text-xs text-secondary">
                    {row.hora}
                </span>
            </div>
        ),
        sortable: true
    },
    {
        label: 'Dispositivo / SO',
        field: 'so',
        render: row => (
            <div>
                <FontAwesomeIcon icon={faDesktop} className="me-2 text-primary" />
                <span className="td-descripcion">
                    {row.so || 'Desconocido'}
                </span>
            </div>
        ),
        sortable: true
    },
    {
        label: 'Navegador',
        field: 'navegador',
        render: row => (
            <div>
                <FontAwesomeIcon icon={faWindowRestore} className="me-2 text-info" />
                <span className="td-numero">
                    {row.navegador || 'N/D'}
                </span>
            </div>
        ),
        sortable: true
    },
    {
        label: 'Dirección IP',
        field: 'ip',
        render: row => (
            <div>
                <FontAwesomeIcon icon={faNetworkWired} className="me-2 text-secondary" />
                <span className="td-numero text-primary">
                    {row.ip || '0.0.0.0'}
                </span>
            </div>
        ),
        sortable: true
    },
    {
        label: 'Zona Horaria',
        field: 'zonaHoraria',
        render: row => (
            <div className="flex items-center">
                <FontAwesomeIcon icon={faGlobe} className="me-2 text-success" />
                <span className="text-xs">
                    {row.zonaHoraria || 'America/La_Paz'}
                </span>
            </div>
        )
    },
    {
        label: 'Estado de Conexión',
        field: 'id',
        render: (row, index) => {
            // Si es el primer registro de la lista (el más reciente), lo marcamos como activo
            const esReciente = parseInt(localStorage.getItem('idSesion')) === row.id; // index 0 es la sesión actual, index 1 es la sesión anterior (más reciente)
            return (
                <span className={`text-descripcion ${esReciente ? 'text-success' : 'text-secondary'}`}>
                    <FontAwesomeIcon 
                        className="me-1" 
                        icon={esReciente ? faCheckCircle : faXmarkCircle} 
                    />
                    {esReciente ? 'Sesión Actual / este dispositivo' : 'Otro dispositivo'}
                </span>
            );
        }
    }
];