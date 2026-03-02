import { useEffect, useRef } from "react";

export function useIsochroneWorker(apiKey) {
    const workerRef = useRef();

    useEffect(() => {
        if (!workerRef.current) {

            workerRef.current = new Worker(new URL('../workers/isochroneWorker.js', import.meta.url));
        }

        return () => {
            workerRef.current?.terminate();
            workerRef.current = null; // opcional: limpiar la referencia
        };
    }, []);




    const calcularIsocronas = (locations, travelTime, callback) => {
        workerRef.current.onmessage = (e) => callback(e.data);

        const batchSize = 10;
        for (let i = 0; i < locations.length; i += batchSize) {
            const batch = locations.slice(i, i + batchSize);
            // enviar batch al Worker

            // console.log(locations, ' coordenadas')
            workerRef.current.postMessage({ batch, travelTime, apiKey });
        }
    };

    return calcularIsocronas;
}
