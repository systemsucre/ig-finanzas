self.onmessage = async function (e) {

    console.log(e.data)
    const { batch, travelTime, apiKey } = e.data;
    


    const resultados = [];

    for (const location of batch) {
        const response = await fetch('https://api.openrouteservice.org/v2/isochrones/driving-car', {

            //   https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
            method: 'POST',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                locations: [location],
                range: [travelTime * 60], // segundos
                units: 'm'
            })
        });

        const data = await response.json();
        resultados.push(data);
    }

    self.postMessage(resultados);
};
