import './style.css'

export async function chooseCities(minLatitude: number, maxLatitude: number, minLongitude: number, maxLongitude: number, cityNum: number): Promise<[string, number, number][]> {
  const citiesWithinRange: [string, number, number][] = [];
  
  const url = "https://api.api-ninjas.com/v1/city/";
  const apiKey = import.meta.env.VITE_API_NINJAS_API_KEY;

  try {
    const response = await fetch(`${url}?min_lat=${minLatitude}&max_lat=${maxLatitude}&min_lon=${minLongitude}&max_lon=${maxLongitude}&limit=${cityNum}`, {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
      },
    });
    const result = await response.json();
    for (const resultObj of result) {
      citiesWithinRange.push(
        [resultObj["name"], resultObj["longitude"], resultObj["latitude"]]
      );
      // for (const [key, value] of Object.entries(resultObj)) {
      //   if (["is_capital", "population", "country"].includes(key)) {
      //     continue;
      //   }
      //   const resultItem = document.createElement("div");
      //   resultItem.innerHTML = `${key} : ${value}`;
      //   (document.getElementById("result2") as HTMLDivElement).appendChild(resultItem);
      // }
    }
    console.log("citiesWithinRange", citiesWithinRange);
    
    return citiesWithinRange;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
