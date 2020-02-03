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


//길찾기 
function getRouting() {
  axios({
      method: 'get',
      url: '/startRouting.do',
      params: {
        startGid,
        endGid
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {});
}



//start, end point 설정
var vectorStartLayer;
var vectorEndLayer;
var vectorSource;
var startGid;
var endGid;
function fnSetPoint(index, feature) {
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
      switch(index) {
        case 0 : 
          startGid = response.data.results[0].gid
        break;
        case 1 :
          endGid = response.data.results[0].gid
        break;
    }

    })
    .catch(function (error) {});
    
}