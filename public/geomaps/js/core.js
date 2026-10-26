
var layer,
    mapExtent = [0, -8192, 8192, 0],
    mapMinZoom = 1,
    mapMaxZoom = 6,
    mapMaxResolution = 0.25,
    mapMinResolution = Math.pow(2, mapMaxZoom) * mapMaxResolution,
    tileExtent = [0, -8192, 8192, 0],
    crs = L.CRS.Simple;

crs.transformation = new L.Transformation(1, -tileExtent[0], -1, tileExtent[3]);
crs.scale = function(r) { return Math.pow(2, r) / mapMinResolution; };
crs.zoom = function(r) { return Math.log(r * mapMinResolution) / Math.LN2; };

var map = new L.Map("map", {
    maxZoom: mapMaxZoom,
    minZoom: mapMinZoom,
    crs: crs
});

layer = L.tileLayer("/geomaps/{z}/{x}/{y}.png", {
    minZoom: mapMinZoom,
    maxZoom: mapMaxZoom,
    tileSize: 512,
    noWrap: true,
    tms: false
}).addTo(map);

map.fitBounds([
    crs.unproject(L.point(mapExtent[2], mapExtent[3])),
    crs.unproject(L.point(mapExtent[0], mapExtent[1]))
]);

L.control.mousePosition().addTo(map);

var numMarker = L.Icon.extend({
    options: {
        iconSize: [19, 27],
        iconAnchor: [19, 27]
    }
});

var cardIcon1 = new numMarker({ iconUrl: "/geomaps/markers/marker.png" });
var cardIcon2 = new numMarker({ iconUrl: "/geomaps/markers/marker.png" });
var cardIcon3 = new numMarker({ iconUrl: "/geomaps/markers/marker.png" });
var cardIcon4 = new numMarker({ iconUrl: "/geomaps/markers/marker.png" });
 
var hash = new L.Hash(map);

 





































