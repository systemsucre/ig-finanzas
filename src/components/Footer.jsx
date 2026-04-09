export function Footer() {
    return (

        <footer className=" py-5" style={{ marginTop: '2rem' }}>
            <div className="container-xl text-center">
                {/* Etiqueta superior pequeña */}
                <p className="text-white mb-1">
                    <small style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Sitio Web Oficial
                    </small>
                </p>

                {/* Línea principal de Copyright */}
                <p className="text-white fs-5 mb-1 fw-bold">
                    © 2026 Copyright MAURI
                </p>

                {/* Derechos reservados */}
                <p className="text-white">
                    <small style={{ fontSize: '10px' }}>
                        Todos los derechos Reservados
                    </small>
                </p>
            </div>
        </footer>
    )
}