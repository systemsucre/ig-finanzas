import { useRouteError } from "react-router-dom";
import { LOCAL_URL } from "../Auth/config";

function E500() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <section className="content">
                <div className="error-page">
                    <h2 className="headline text-danger">{'404 - Pagina no disponible'}</h2>

                    <div className="error-content">
                        <p>
                            Trabajaremos para solucionarlo de inmediato. Mientras tanto, puede
                            <a style={{ color: 'blue' }} href={ LOCAL_URL+'/'}> volver a la pagina de inicio</a>.
                        </p>

                    </div>
                </div>
            </section>
        </div>
    )

}
export default E500