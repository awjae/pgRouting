
var BingMapKey="Ar-WkIA7R3sY5gwqt0oUGHrGTnxGGFCF4EOaAjgZ2D9JdF5EuXZdhpXxbE7PQnxa";
var thunderKey="49e1ad1fd1054c638c9f20bc8b5f42e6";
var mapKey = 'pk.eyJ1IjoiYXctamFlIiwiYSI6ImNrMTVubTJlbzB3dG0zbXRjaXE0M3FvZm4ifQ.4Bguqsxsl67BekIMBWgmVA';

var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [126.89536213874817, 37.48130679130554],
      zoom: 17
    })
  });


map.on('click', function(evt) {
  console.log(evt.coordinate)
  let map = document.getElementById('map')
  map.style.cursor = ""
  let startLng = document.getElementById('startLng')
  let startLat = document.getElementById('startLat')
  let endLng = document.getElementById('endLng')
  let endLat = document.getElementById('endLat')

  switch(map.dataset.use) {
    case "start" :
      startLng.innerHTML = "startLng : " + evt.coordinate[0].toFixed(3) + " ,  "
      startLat.innerHTML = "startLng : " + evt.coordinate[1].toFixed(3)
      break;
    case "end" : 
      endLng.innerHTML = "endLng : " + evt.coordinate[0].toFixed(3) + " ,  "
      endLat.innerHTML = "endLat : " + evt.coordinate[1].toFixed(3)
      break;
  }

  map.dataset.use = ""
})

