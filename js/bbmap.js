// The URL containing bounding boxes.
var bboxUrl = 'https://s3.amazonaws.com/metro-extracts.mapzen.com/cities.json';

// A Leaflet map to draw bounding boxes of the extracted metros.

/* Global variable holding the Leaflet map */
var map;

/* Construct the base Leaflet map */
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

/* Event function generator to scroll to the given city */
function scrollToCity(cityName) {
    var t = cityName;
    return function() {
        var cityElement = $("li." + t);
        $('html, body').animate({
            scrollTop: (cityElement.offset().top - 50)
        }, 300);
    };
}

/* Add bounding boxes to the map for the cities in the loaded data. */
function addBoundingBoxes(data) {
    for (var regionName in data.regions) {
        var region = data.regions[regionName];

        for (var cityName in region.cities) {
            var city = region.cities[cityName],
                bounds = city.bbox;

            var polygon = L.polygon([[+bounds.top, +bounds.left], [+bounds.top, +bounds.right],
                                     [+bounds.bottom, +bounds.right], [+bounds.bottom, +bounds.left]],
                                    { weight: 1.5, color: "#000",
                                     fillColor: "#82c", fillOpacity: 0.5 });

            polygon.on('click', scrollToCity(cityName));
            polygon.addTo(map);
        }
    }
}

/* Main script */

// Make the map area
makeBbMap();

// Load the metro data file and add the bounding boxes
$(function(){
    $.ajax({
        url: bboxUrl,
        dataType: "json",
        success: addBoundingBoxes,
        error: function(request, status, error) {
            console.log("Error loading", bboxUrl, request, status, error);
        }
    })});
