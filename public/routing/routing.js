var startNodeLng = '';
var startNodeLat = '';
var endNodeLng = '';
var endNodeLat = '';


var BingMapKey = "Ar-WkIA7R3sY5gwqt0oUGHrGTnxGGFCF4EOaAjgZ2D9JdF5EuXZdhpXxbE7PQnxa";
var thunderKey = "49e1ad1fd1054c638c9f20bc8b5f42e6";
var mapKey = 'pk.eyJ1IjoiYXctamFlIiwiYSI6ImNrMTVubTJlbzB3dG0zbXRjaXE0M3FvZm4ifQ.4Bguqsxsl67BekIMBWgmVA';

var pointStyle = {
  "startPoint": new ol.style.Style({
    image: new ol.style.Icon({
      src: '/images/start_icon.png'

    })
  }),
  "endPoint": new ol.style.Style({
    image: new ol.style.Icon({
      src: '/images/end_icon.png'

    })
  })
}





function fnStartSetButton() {
  let map = document.getElementById('map')
  map.style.cursor = "crosshair"
  map.dataset.use = "start"
}

function fnEndSetButton() {
  let map = document.getElementById('map')
  map.style.cursor = "crosshair"
  map.dataset.use = "end"
}

var resGeoJson;
var geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:4326'
    }
  },
  'features': [],
};
//길찾기 
var geoJSONLayer;
var vectorSource;
function getRouting() {
  geojsonObject.features = [];
  map.removeLayer(geoJSONLayer);
  document.getElementsByClassName('mapShade')[0].style.display = 'block';

  axios({
      method: 'get',
      url: '/startRouting.do',
      params: {
        startGid,
        endGid
      }
    })
    .then(function (response) {
      console.log(response)
      resGeoJson = response.data.results;
      document.getElementById('distance').innerHTML = (resGeoJson[0].distence / 1000 ).toFixed(2)  + ' km'
      
      //geoJSON Data 바인딩
      for (result in resGeoJson) {
        var rows = {
          'type': 'Feature',
          'geometry': {
          }
        }

        rows.geometry = JSON.parse(resGeoJson[result].st_asgeojson)
        geojsonObject.features.push(rows)
      }

      //geoJSON -> Layer
      vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
      });
      geoJSONLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
          })
        }) 
      });
      map.addLayer(geoJSONLayer);

      document.getElementsByClassName('mapShade')[0].style.display = 'none';
    })
    .catch(function (error) {});
}



//start, end point 설정
var vectorStartLayer;
var vectorEndLayer;
var vectorSource;
var startGid;
var endGid;
var startNodeGeomLayer;
var endNodeGeomLayer;
function fnSetPoint(index, feature) {
    document.getElementsByClassName('mapShade')[0].style.display = 'block';
    var lng;
    var lat;
    switch(index) {
        case 0 : 
            map.removeLayer(vectorStartLayer);
            vectorSource = new ol.source.Vector({
                features: [feature]
            });
            vectorStartLayer = new ol.layer.Vector({
                source: vectorSource
            });
            map.addLayer(vectorStartLayer);
            lng = startNodeLng
            lat = startNodeLat
        break;
        case 1 :
            map.removeLayer(vectorEndLayer);
            vectorSource = new ol.source.Vector({
                features: [feature]
            });
            vectorEndLayer = new ol.layer.Vector({
                source: vectorSource
            });
            map.addLayer(vectorEndLayer);
            lng = endNodeLng
            lat = endNodeLat
        break;
    }
    
    axios({
      method: 'get',
      url: '/setClosePoint.do',
      params: {
        lng,
        lat,
      }
    })
    .then(function (response) {
      document.getElementsByClassName('mapShade')[0].style.display = 'none';
      console.log(response.data.results[0].gid)
      console.log(response.data.results[0].x)

      var circleStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,0,0,0.7)'
        }),
        image: new ol.style.Circle({
          radius: 5,
          fill: null,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width : 3
          })
        })
      })

      switch(index) {
        case 0 : 
          map.removeLayer(startNodeGeomLayer);
          startGid = response.data.results[0].gid
          var startNodeGeom = new ol.Feature({
            geometry: new ol.geom.Point([response.data.results[0].x, response.data.results[0].y]),
            name: 'satrt',
            population: 4000,
            rainfall: 500
          });
          startNodeGeom.setStyle(circleStyle);
          var startNodeGeomSource = new ol.source.Vector({
            features : [startNodeGeom]
          })
          startNodeGeomLayer = new ol.layer.Vector({
            source: startNodeGeomSource
          });
          map.addLayer(startNodeGeomLayer);
        break;
        case 1 :
          map.removeLayer(endNodeGeomLayer);
          endGid = response.data.results[0].gid
          var endNodeGeom = new ol.Feature({
            geometry: new ol.geom.Point([response.data.results[0].x, response.data.results[0].y]),
            name: 'satrt',
            population: 4000,
            rainfall: 500
          });
          endNodeGeom.setStyle(circleStyle);
          var endNodeGeomSource = new ol.source.Vector({
            features : [endNodeGeom]
          })
          endNodeGeomLayer = new ol.layer.Vector({
            source: endNodeGeomSource
          });
          map.addLayer(endNodeGeomLayer);
        break;
      }      
    })
    .catch(function (error) {});
    
}