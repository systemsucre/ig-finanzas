import { useState, useEffect } from 'react';
import * as ss from 'simple-statistics';
import Select from 'react-select';

import { useDashboard } from '../hooks/useDashboard';
// 1. SOLO importa lo que pertenece a recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { faArrowUp, faArrowDown, faWallet, faClipboardList, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 2. Define CardKPI AQUÍ AFUERA (o dentro del componente, pero no lo importes de recharts)
const CardKPI = ({ titulo, monto, icono, color, moneda, monedas, tipo = 'Numerico' }) => (
    <div className="col-md-3 col-sm-6" style={{ marginBottom: '0px' }} >
        <div className="card border-0 shadow-sm p-3 mb-3" style={{ borderRadius: '15px', background: 'rgba(255,255,255 ,.2)' }}  >
            <div className="d-flex align-items-center ">
                <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${color}15`, color: color }}>
                    <FontAwesomeIcon icon={icono} size="lg" />
                </div>
                <div className='' style={{ width: '65%' }}>
                    <p className="text-center text-white small mb-0 fw-bold">{titulo}</p>
                    <h5 className="text-white text-center fw-bold mb-0"> {tipo === 'porcentaje' ? '%' : monedas.find(e => e.value === moneda.campo)?.simbolo} {Number(monto || 0).toLocaleString()}</h5>
                </div>
            </div>
        </div>
    </div>
);

const DashboardFinanciero = () => {
    const { kpis, stats, moneda, setMoneda, monedas, refresh, listarHistorico, cargarDashboardAux, cargando, dataConPrediccion, historicoAll } = useDashboard();
    const [montado, setMontado] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMontado(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (cargando) return <div className="p-5 text-center">Cargando métricas...</div>;







    const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    // 1. Convertimos los resultados del SQL en objetos para el gráfico
    const datosGrafico = historicoAll.map(item => ({
        // Creamos una etiqueta tipo "Mar/2026"
        name: `${nombresMeses[item.mes - 1]}/${item.anio}`,
        utilidadReal: item.total_ingresos - item.total_gastos,
        // Guardamos el valor numérico para ordenar si fuera necesario
        timestamp: new Date(item.anio, item.mes - 1).getTime()
    }));

    // 2. Ordenar por fecha (por si el SQL fallara en el orden)
    datosGrafico.sort((a, b) => a.timestamp - b.timestamp);

    // 3. Conexión con la IA
    if (datosGrafico.length > 0) {
        const ultimoPunto = datosGrafico[datosGrafico.length - 1];

        datosGrafico.push({
            name: 'Proyección',
            utilidadReal: ultimoPunto.utilidadReal, // Punto de anclaje
            utilidadPredicha: dataConPrediccion.prediccion
        });
    }
    const datosFiltrados = datosGrafico
    // Si tienes 2025 y 2026: Verás una línea larga que va desde Ene/2025... pasando por Dic/2025 y continuando hacia Ene/2026.

    // Evitas el "encimado": Si solo usaras "Marzo", los datos de marzo de ambos años se sumarían en un solo punto, lo cual sería un error financiero grave.







    // 1. Desviación Estándar (Volatilidad)

    //     Esto te dice qué tan "estables" son tus ingresos.En un estudio jurídico, esto es clave para saber si puedes permitirte gastos fijos grandes.

    // Baja desviación: Tus ingresos son constantes(predecible).

    // Alta desviación: Un mes ganas mucho y otro nada(riesgoso).
    const utilidades = historicoAll.map(h => h.total_ingresos - h.total_gastos);
    // console.log(utilidades)
    // Antes: ss.standardDeviation(utilidades)
    const volatilidad = utilidades.length > 0 ? ss.standardDeviation(utilidades) : 0;

    // console.log(volatilidad, ' volatilidad')

    // Si la volatilidad es muy alta comparada con el promedio, necesitas un fondo de emergencia.


    // 2. Coeficiente de Correlación ($r$)

    //     Este es oro puro. Te sirve para saber si X influye en Y.
    // Por ejemplo: ¿Si suben los gastos en "Boletas de combustible", suben también los ingresos por "Trámites"?

    // Comparamos el array de Gastos vs el de Ingresos
    // Filtramos para que solo entren meses donde hubo ingresos Y gastos registrados
    const historicoFiltrado = historicoAll.filter(h => h.total_ingresos > 0 || h.total_gastos > 0);
    let correlacion = null
    // console.log('data mostrado historico filtrado ', historicoFiltrado)
    if (historicoFiltrado.length > 1) {
        const gastos = historicoFiltrado.map(h => parseFloat(h.total_gastos));
        const ingresos = historicoFiltrado.map(h => parseFloat(h.total_ingresos));

        correlacion = ss.sampleCorrelation(ingresos, gastos);
        console.log("Correlación Real:", correlacion, historicoAll);
    } else {
        console.log("No hay suficientes datos variables para calcular la correlación.");
    }
    /* r = 1: Relación perfecta (si gastas más, ganas más).
       r = 0: No tiene nada que ver.
       r = -1: Relación inversa (mientras más gastas, menos ganas).
    */

    //     3. Análisis de Outliers(Valores Atípicos)
    // Sirve para detectar meses "raros" que ensucian tu estadística.Por ejemplo, un mes donde entró un pago gigante por un juicio de años, o un mes de pérdida total.

    const utilidadesActivas = utilidades.filter(u => u > 0);
    // utilidadesActivas ahora es [647, 3000, 5000]
    let outliersReales = 0
    if (utilidadesActivas.length >= 3) {
        const q1 = ss.quantile(utilidadesActivas, 0.25);
        const q3 = ss.quantile(utilidadesActivas, 0.75);
        const iqr = q3 - q1;

        const limiteSuperior = q3 + 1.5 * iqr;
        outliersReales = utilidadesActivas.filter(u => u > limiteSuperior);

        // console.log("Outliers Reales:", outliersReales); // Debería salir [] vacío
    }
    let mensajeOutliers = "";

    if (outliersReales.length > 0) {
        // Si hubiera un outlier de, por ejemplo, 20,000 Bs.
        mensajeOutliers = `Se detectó un ingreso excepcional de Bs. ${outliersReales[0]}. Este valor no se usará para proyecciones futuras para evitar falsas expectativas.`;
    } else {
        // Tu caso actual
        mensajeOutliers = "El flujo de ingresos actual es orgánico y sigue la tendencia del mercado.";
    }
    // console.log("Percentiles Reales:", historicoAll, utilidades);


    //     4. Percentiles(Metas de Rendimiento)
    // Puedes decirle al sistema: "Dime el monto de utilidad que superamos el 80% de las veces".Esto te ayuda a fijar sueldos base seguros para los socios de KR - Estudios.



    // Antes: ss.quantile(...)
    const utilidadesFiltradas = utilidades.filter(u => u > 0);
    const sueldoSeguro = utilidadesFiltradas.length > 0
        ? ss.quantile(utilidadesFiltradas, 0.20)
        : 0;

    // El 80% de los meses hemos ganado al menos esta cantidad. 
    //     Interpretación: El percentil 0.20 (20%) actuando sobre tus meses activos significa que, estadísticamente, el 80% de las veces tu utilidad será igual o mayor a Bs. 1588.20.

    // Para qué sirve: Este es el número que deberías usar para planificar gastos fijos. Si el estudio tiene un costo fijo (luz, internet, alquiler) menor a esa cifra, 
    // tienes un 80% de probabilidad de cubrirlos sin problemas basándote en tu historial reciente.



    //     5. Error Estándar de la Regresión(Margen de Error)
    // Para que tu mensaje de la IA sea honesto, puedes añadir el margen de error a la predicción.
    const datosParaRegresion = utilidadesActivas.map((u, index) => [index + 1, u]);

    // 1. Validamos que existan suficientes datos para una línea
    const puedeCalcularRegresion = datosParaRegresion.length >= 2;

    let linea = null;
    let formula = () => 0;
    let errorEstandar = 0;

    if (puedeCalcularRegresion) {
        linea = ss.linearRegression(datosParaRegresion);
        formula = ss.linearRegressionLine(linea);

        const residuos = datosParaRegresion.map(punto => {
            const [x, yReal] = punto;
            const yPredicho = formula(x);
            return Math.pow(yReal - yPredicho, 2);
        });

        const sumaResiduos = ss.sum(residuos);
        const n = datosParaRegresion.length;
        // Evitamos división por cero o negativo con n > 2
        errorEstandar = n > 2 ? Math.sqrt(sumaResiduos / (n - 2)) : 0;
    }

    return (
        <main className="container-xl mt-5" style={{ maxWidth: "100%", marginTop: '2rem' }}>
            <div>
                <h3 className="text-dark fw-bold mb-0 p-2 text-titulos">Gestión Financiera {new Date().getFullYear()}</h3>
            </div>
            <div className="panel-custom  rounded shadow-sm p-2 mx-2" >
                {/* Fila de Cards KPI - Ahora sí funcionará */}
                <div className="row g-3 ">
                    <CardKPI titulo="INGRESOS" monto={kpis.ingresos} icono={faArrowUp} color="#10b981" moneda={moneda} monedas={monedas} />
                    <CardKPI titulo="GASTOS" monto={kpis.gastos} icono={faArrowDown} color="#f43f5e" moneda={moneda} monedas={monedas} />
                    <CardKPI titulo="SALDO NETO" monto={kpis.saldo} icono={faWallet} color="#6366f1" moneda={moneda} monedas={monedas} />
                    <CardKPI titulo="REI <70" monto={(kpis.gastos / kpis.ingresos) * 100} icono={faClipboardList} color="#f59e0b" moneda={moneda} monedas={monedas} tipo={'porcentaje'} />
                </div>

                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px', minHeight: '450px' }}>
                    <h6 className="text-white fw-bold mb-4" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Flujo de Caja Mensual ({monedas.find(e => e.value === moneda.campo)?.simbolo})</h6>
                    <div className="col-md-4">
                        <label className="text-white">Seleccionar Moneda </label>
                        <Select
                            placeholder='Busque por código caja...'
                            onChange={(e) => {
                                if (e) {
                                    const nuevoId = e.value;
                                    setMoneda({ campo: nuevoId, valido: 'true' });
                                    localStorage.setItem('moneda', nuevoId);
                                    // Llamamos a la función unificada pasando el nuevo ID directamente
                                    refresh(nuevoId);
                                    listarHistorico(nuevoId)
                                }
                            }}
                            options={monedas}
                            value={monedas.find(opt => opt.value === moneda.campo) || null}
                            isSearchable={true}
                            isClearable={true}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: 'transparent', // Fondo transparente
                                    borderRadius: '10px',
                                    padding: '5px',
                                    borderColor: '#dee2e6',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: '#dee2e6'
                                    }
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: '#fff' // Color del texto seleccionado (blanco para que resalte sobre el fondo oscuro)
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: 'rgba(255, 255, 255, 0.7)' // Color del placeholder semi-transparente
                                }),
                                menu: (base) => ({
                                    ...base,
                                    backgroundColor: '#ffffff', // Fondo de la lista desplegable blanco
                                    borderRadius: '10px',
                                    zIndex: 9999 // Asegura que se vea por encima de otros elementos
                                }),
                                option: (base, { isFocused, isSelected }) => ({
                                    ...base,
                                    backgroundColor: isSelected
                                        ? '#10b981' // Color si está seleccionado (verde esmeralda)
                                        : isFocused
                                            ? '#f1f5f9' // Color al pasar el mouse (gris muy claro)
                                            : '#ffffff', // Color por defecto
                                    color: isSelected ? '#fff' : '#333', // Texto oscuro en la lista para legibilidad
                                    cursor: 'pointer',
                                    '&:active': {
                                        backgroundColor: '#10b981'
                                    }
                                })
                            }}
                        />
                    </div>
                    <div style={{
                        width: '100%',
                        // marginTop: '1rem',
                        height: '350px',
                        minWidth: 0,        // Evita que el flexbox colapse a -1
                        minHeight: '350px', // Asegura que el alto no sea 0
                        position: 'relative'
                    }}>
                        {montado && stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    key={stats.length + moneda.campo} // <-- ESTO ES CLAVE
                                    data={stats}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="mes"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val.toLocaleString()}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${monedas.find(e => e.value === moneda.campo)?.simbolo} ${Number(value).toLocaleString()}`, '']}
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="top" align="right" height={36} />
                                    <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar dataKey="gastos" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted italic">
                                {cargando ? "Cargando datos..." : "No hay datos para mostrar."}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lado derecho: Salud Financiera */}
                <div className="row g-3 mb-4">

                    <div className="col-md-6 col-sm-6 mb-4">
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4">
                                <h1 className="text-white display-5 fw-bold">
                                    {((kpis.saldo / kpis.ingresos) * 100 || 0).toFixed(1)}%
                                </h1>
                                <p className="text-white">Margen de Utilidad Neta</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-6 mb-4 "  >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4">
                                <h1 className="text-white display-5 fw-bold">
                                    {(kpis.ingresos / kpis.gastos || 0).toFixed(1)}
                                </h1>
                                <p className="text-white">RATIO</p>
                            </div>

                        </div>
                    </div>


                </div>


                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px', minHeight: '450px' }}>
                    <h6 className="text-white fw-bold mb-4" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Tendencia de ingresos mes siguiente</h6>

                    <div style={{
                        width: '100%',
                        // marginTop: '1rem',
                        height: '350px',
                        minWidth: 0,        // Evita que el flexbox colapse a -1
                        minHeight: '350px', // Asegura que el alto no sea 0
                        position: 'relative'
                    }}>
                        {montado && datosFiltrados.length > 0 ? (<>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart width={600} height={300} data={datosFiltrados}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    {/* <XAxis dataKey="name" /> */}
                                    <XAxis
                                        dataKey="name"
                                        interval="preserveStartEnd" // Ayuda a que no se amontonen las etiquetas
                                        minTickGap={30}             // Espacio mínimo entre etiquetas de meses
                                        tick={{ fontSize: 11 }}     // Letra un poco más pequeña para dar espacio
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => `${monedas.find(e => e.value === moneda.campo)?.simbolo} ${value.toFixed(2)}`}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '10px' }}
                                    />
                                    <Legend />

                                    {/* Línea de los datos que ya pasaron */}
                                    <Line
                                        type="monotone"
                                        dataKey="utilidadReal"
                                        stroke="#8884d8"
                                        strokeWidth={3}
                                        dot={{ r: 6 }}
                                    />

                                    {/* Línea de la IA (Predicción) */}
                                    <Line
                                        type="monotone"
                                        dataKey="utilidadPredicha"
                                        stroke="#82ca9d"
                                        strokeDasharray="5 5"
                                        strokeWidth={3}
                                        connectNulls // Importante para unir el último real con el futuro
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className={`mt-3 p-2 rounded shadow-sm bg-light border-start border-4 ${dataConPrediccion.pendiente > 0 ? 'border-success' : 'border-danger'}`} >
                                <p className={`mb-0  text-center bg-white ${dataConPrediccion.pendiente > 0 ? 'text-success' : 'text-danger'}`} style={{ borderRadius: '5px', padding: '10px' }}>
                                    <FontAwesomeIcon icon={faRobot} className="me-2" />
                                    Hola {localStorage.getItem('nombre')?.split(' ')[0]} tenemos una {dataConPrediccion.mensaje}
                                </p>
                            </div>
                        </>
                        ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted italic">
                                {cargando ? "Cargando datos..." : "No hay datos para mostrar."}
                            </div>
                        )}

                    </div>
                </div>

                <div className="row g-3 mb-4" style={{ marginBottom: '7rem' }}>

                    <div className="col-md-4 col-sm-6 mb-4" >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4" >
                                <h1 className="text-white display-5 fw-bold" style={{ fontSize: '2rem' }}>
                                    {volatilidad?.toFixed(2)}
                                </h1>
                                <p className="text-white">Volatilidad </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-sm-6 mb-4 "  >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4" >
                                <h1 className="text-white display-5 fw-bold" style={{ fontSize: '2rem' }}>
                                    {correlacion?.toFixed(2)}
                                </h1>
                                <p className="text-white">Correlación</p>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 mb-4 "  >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4" >
                                <h1 className={`${outliersReales.length > 0 ? 'text-danger' : 'text-success'} display-5 fw-bold `} style={{ fontSize: '1rem' }}>
                                    {mensajeOutliers}
                                </h1>
                                <p className="text-white">Outlier</p>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-4 col-sm-6 mb-4 "  >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4" >
                                <h1 className="text-white display-5 fw-bold" style={{ fontSize: '2rem' }}>
                                    {monedas.find(e => e.value === moneda.campo)?.simbolo} {sueldoSeguro?.toFixed(2)}
                                </h1>
                                <p className="text-white">Flujo positivo seguro al 80%</p>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-4 col-sm-6 mb-4 "  >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>
                            <div className="py-4" >
                                <h1 className="text-white display-5 fw-bold" style={{ fontSize: '1.4rem' }}>
                                    {`Margen de error: ± ${monedas.find(e => e.value === moneda.campo)?.simbolo}. ${errorEstandar?.toFixed(2)}`}
                                </h1>
                                <p className="text-white">Error Estandar</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default DashboardFinanciero;