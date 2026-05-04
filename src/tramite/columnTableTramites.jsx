import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ColumnsTableTramites = [
  window.innerWidth > 877 ?
    {
      label: 'Numero',
      field: 'numero',
      render: (row) => (
        <div className="td-numero">
          <span className="ms-2"> {row.numero}</span>
        </div>
      )
    } : {},

  {
    label: 'Caja',
    field: 'codigo',
    render: (row) => (
      <div className="td-descripcion">
        <span className="ms-2">{row.codigo}</span>
      </div>
    )
  },
  window.innerWidth > 877 ?
    {
      label: 'MONEDA',
      field: 'sinmbolo',
      render: (row) => (
        <div className="td-descripcion">
          <span className="ms-2">{row.simbolo}</span>
        </div>
      ),
    } : {},
  {
    label: 'Detalle',
    field: 'detalle',
    render: (row) => (

      <div className="td-detalle">
        {row.detalle?.substring(0, 60)}...
      </div>
    ),
  },
  window.innerWidth > 877 ?
    {
      label: 'Tipo Caja',
      field: 'nombre_tipo_tramite',
      render: (row) => (


        <div className="td-numero">
          <span className="ms-2">{row.nombre_tipo_tramite}</span>
        </div>
      ),
    } : {},


  {
    label: 'Estado',
    field: 'estado',
    render: (row) => (
      <>
        <span
          className={`td-numero badge ${row.estado === 1 ? 'text-success' : 'bg-warnsing text-warning'}`}

        >
          {row.estado === 1
            ? 'EN CURSO'
            : row.estado === 2
              ? 'PARALIZADO'
              : 'FINALIZADO'}
        </span>{' '}
        <br />
        <span
          className={`td-numero badge ${row.eliminado === 0 ? 'text-danger' : 'bg-warnsing text-warning'}`}

        >
          {row.eliminado === 0 ? 'Eliminado' : ''}
        </span>
      </>
    ),
  },
  {
    label: 'Plazo y Fechas',
    field: 'fecha_finalizacion',
    render: (row) => {
      const hoy = new Date();
      const vencimiento = new Date(row.fecha_finalizacion);
      const diasRestantes = Math.ceil(
        (vencimiento - hoy) / (1000 * 60 * 60 * 24),
      );

      let color = 'text-success';
      if (diasRestantes <= 7) color = 'text-warning fw-bold';
      if (diasRestantes <= 3) color = 'text-danger fw-bold animate-pulse';

      return (
        <>
          <div className="td-numero" >
            <FontAwesomeIcon className="me-2" icon={faCalendar} />
            Apertura: {new Date(row.fecha_ingreso).toLocaleDateString()}
            <br />
            <FontAwesomeIcon className="me-2" icon={faCalendar} />

            Cierre estimado: {vencimiento.toLocaleDateString()}
            <br />
            {diasRestantes > 0
              ? `${diasRestantes} días restantes`
              : 'Plazo vencido'}
          </div>
        </>
      );
    },
  },
  {
    label: 'Movimientos',
    field: 'costo',
    render: (row) => {
      const costo = row.costo || 0;
      return (
        <div className="text-end">
          <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
            GASTOS : {row.simbolo} {row.total_gastos}
          </div>
          {/* {localStorage.getItem('numRol') != 4 ?
                        <div className=" fw-bold text-muted text-success italic" style={{ fontSize: '0.7rem' }}>
                            COSTO TRAMITE  Bs. {costo}
                        </div>
                        : null} */}
          <div
            className=" fw-bold text-muted text-success italic"
            style={{ fontSize: '0.7rem' }}
          >
            MONTO ABONADO {row.simbolo} {row.total_ingresos}
          </div>
          <div
            className={`fw-bold ${row.saldoDisponible > 2000 ? `text-dark` : row.saldoDisponible > 1000 ? `text-warning` : `text-danger`}`}
            style={{ fontSize: '0.7rem' }}
          >
            SALDO DISP. {row.simbolo} {row.saldoDisponible}
          </div>
        </div>
      );
    },
  },
];
