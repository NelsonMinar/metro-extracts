// The URL containing bounding boxes.
// TODO: remove corsproxy when S3 headers are set correctly
var bboxUrl = 'http://www.corsproxy.com/s3.amazonaws.com/metro-extracts.mapzen.com/cities.json';

// A Leaflet map to draw bounding boxes of the extracted metros.

var map;
function makeBbMap()
{
    // Create the leaflet base map
    map = L.map('bbMap', {scrollWheelZoom: false});
    map.setView([20, 0], 2);
    var basemap = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg', {
            attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/">MapQuest</a>, map data © <a href="http://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 7,
            subdomains: '1234',
            noWrap: false,
    });
    basemap.addTo(map);
};

function addBoundingBoxes(data) {
    for (var regionName in data.regions) {
        var region = data.regions[regionName];
        // Render a box for each city, create the popup
        for (var cityName in region.cities) {
            var city = region.cities[cityName],
                bounds = city.bbox;

            var polygon = L.polygon([[+bounds.top, +bounds.left], [+bounds.top, +bounds.right],
                                     [+bounds.bottom, +bounds.right], [+bounds.bottom, +bounds.left]],
                                    { weight: 1.5, color: "#000",
                                     fillColor: "#82c", fillOpacity: 0.5 });
            /* var popupData = [
                '<b><a href="#' + city.slug + '">' + city.name + '</a></b><br>',
                city.area + '<br>',
                city.osm_size + " bzip’ed XML OSM data<br>",
                city.pbf_size + " binary PBF OSM data<br>",
                '<p>',
                '<a href="#' + city.slug + '"><img src="previews/' + city.slug + '.jpg" width="155" height="100"></a>',
            ];  */

            polygon.bindPopup(cityName.replace(/-/g, ' '));
            polygon.addTo(map);
        }
    }
}

makeBbMap();
$(function(){
    $.ajax({
        url: bboxUrl,
        dataType: "json",
        success: addBoundingBoxes,
        error: function(request, status, error) {
            console.log("Error loading", bboxUrl, request, status, error);
        }
    })});
