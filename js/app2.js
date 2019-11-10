
var basemap = new L.TileLayer(baseUrl, {maxZoom: 17, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});

var center = new L.LatLng(0, 0);


var map = new L.Map('map', {center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap]});

//var markers = new  L.markerClusterGroup();
var markers = new L.MarkerClusterGroup();

markers.addLayer(L.marker(getRandomLatLng(map)));
map.addLayer(markers);

function getRandomLatLng(map) {
			var bounds = map.getBounds(),
				southWest = bounds.getSouthWest(),
				northEast = bounds.getNorthEast(),
				lngSpan = northEast.lng - southWest.lng,
				latSpan = northEast.lat - southWest.lat;

			return new L.LatLng(
					southWest.lat + latSpan * Math.random(),
					southWest.lng + lngSpan * Math.random());
		}