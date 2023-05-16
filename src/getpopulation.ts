import './style.css'

const url = "https://api.api-ninjas.com/v1/city/";
const apiKey = import.meta.env.VITE_API_NINJAS_API_KEY;

function chooseCities(minLatitude: number, maxLatitude: number, minLongitude: number, maxLongitude: number): [number, number][] {

  var citiesWithinRange: [number, number][] = [];

  fetch(`${url}?min_lat=${minLatitude}&max_lat=${maxLatitude}&min_lon=${minLongitude}&max_lon=${maxLongitude}&limit=30`, {
    method: "GET",
    headers: {
      "X-Api-Key": apiKey,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      // resultObj: Object[ 各都市の情報 ]
      for (var resultObj of result) {
        citiesWithinRange.push(([resultObj["longitude"], resultObj["latitude"]]));
        for (const [key, value] of Object.entries(resultObj)) {
          if (["is_capital", "population", "country"].includes(key)) {
            continue;
          }
          var resultItem = document.createElement("div");
          resultItem.innerHTML = `${key} : ${value}`;
          (document.getElementById("result2") as HTMLDivElement).appendChild(resultItem);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });

    return citiesWithinRange;
}

chooseCities(35, 36, 135, 136);