import './style.css'

function initMap(): void {
  const bounds = new google.maps.LatLngBounds();
  const markersArray: google.maps.Marker[] = [];

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 55.53, lng: 9.4 },
      zoom: 10,
    }
  );

  // initialize services
  const geocoder = new google.maps.Geocoder();
  const service = new google.maps.DistanceMatrixService();

  // build request
  const origin1 = "Sanjo station, Kyoto";
  const origin2 = "広島県広島市西区古江上２丁目５０２−７";
  const origin3 = "大阪府枚方市田宮本町8-55";
  const destinationA = "Hyakumanben, Kyoto";
  const destinationB = "Abeno, Japan";

  const request = {
    origins: [origin1, origin2, origin3],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

  // put request on page
  // (document.getElementById("request") as HTMLDivElement).innerText =
    // JSON.stringify(request, null, 2);

  // get distance matrix response
  service.getDistanceMatrix(request).then((response) => {
    // put response
    // (document.getElementById("response") as HTMLDivElement).innerText =
    //     JSON.stringify(response, null, 2);

    // show on map
    const originList = response.originAddresses;
    const destinationList = response.destinationAddresses;

    deleteMarkers(markersArray);

    const showGeocodedAddressOnMap = (asDestination: boolean) => {
      const handler = ({ results }: google.maps.GeocoderResponse) => {
        map.fitBounds(bounds.extend(results[0].geometry.location));
        markersArray.push(
          new google.maps.Marker({
            map,
            position: results[0].geometry.location,
            label: asDestination ? "D" : "O",
          })
        );
      };

      return handler;
    };

    var resultList = []
    for (let i = 0; i < originList.length; i++) {
      const results = response.rows[i].elements;

      geocoder
        .geocode({ address: originList[i] })
        .then(showGeocodedAddressOnMap(false));

      for (let j = 0; j < results.length; j++) {
        geocoder
          .geocode({ address: destinationList[j] })
          .then(showGeocodedAddressOnMap(true));

        resultList.push(originList[i] + "\n→\n" + destinationList[j] + "\n" + Math.floor(results[j].duration.value / 60) + "分");
      }
    }

    const resultElement = document.getElementById("result");
    resultList.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.innerHTML = item;
      if (resultElement !== null) {
        resultElement.appendChild(itemElement);
        resultElement.appendChild(document.createElement("br"));
      }
    })
  });
}

function deleteMarkers(markersArray: google.maps.Marker[]) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }

  markersArray = [];
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export { };