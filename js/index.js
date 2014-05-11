var url = "https://s3.amazonaws.com/metro-extracts.mapzen.com";

var getReadableDate= function (date) {
    var d = new Date(date);
    var r = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    return "Last Updated: <span class='datetime'>" + r + "</span>";
}

var getReadableFileSize = function(bytes) {
    var formats = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + formats[i];
};

// The order matters! (for presentational purposes)
var formats = ['osm.pbf', 'osm.bz2', 'osm2pgsql-shapefiles.zip', 'imposm-shapefiles.zip'];
var readable= ['OSM PBF', 'OSM XML', 'OSM2PGSQL SHP', 'IMPOSM SHP'];

var displayReadableFormat = function(format) {
    return readable[formats.indexOf(format)] || undefined;
};

var displayReadableDate = function(date) {
    $("#last_updated_at").html(getReadableDate(date));
};

var sortFormatDisplay = function(d, list) {
    var another_list =[];
    another_list = list.sort(function (a, b) {
        if (formats.indexOf(a.format) < formats.indexOf(b.format))
            return -1;
        return 1;
    });
    for (var i=0; i<another_list.length; i++){
        d.append(another_list[i].tag);
    }
};

var contentsToList = function (contents){
    if (contents.length > 0)
    {
        var ul = $('<ul/>');
        var lists     = [];
        contents.each(function(){
            var $this = $(this);
            var key   = $this.children('key').text();
            var size  = $this.children('size').text();
            if (key == 'cities.json') {
              return true;
            }
            if (key == 'LastUpdatedAt') {
                displayReadableDate($this.children('LastModified').text());
                return true;
            }
            var name  = key.substring(0,key.indexOf('.'));
            var format= key.substring(key.indexOf('.')+1);
            var exists= lists.hasOwnProperty(name);
            var li    = $('<li/>');
            var div   = $("<div/>");
            var anchor= [];
            var last_modified = $this.children('LastModified').text();

            if (exists) {
                li  = lists[name]["li"];
                div = lists[name]["div"];
                anchor=lists[name]["anchor"];
            } else {
                lists = [];
                li.addClass(name);
                li.append("<h5 class ='place_name'>" + name.replace(/-/g, ' ') + "</h5>");
                div.addClass("btn-group");
                lists[name] = {"li":li, "div":div, "anchor": []};
            }

            var a     = $('<a/>',{
                text: displayReadableFormat(format) + " (" + getReadableFileSize(size) + ")",
                href: url + "/" + key,
                class: "btn btn-default format metro-format",
                'data-name': name.replace(/-/g, ' '),
                'data-format': displayReadableFormat(format)
            });
            lists[name]["anchor"].push({"format":format, "tag": a});
            sortFormatDisplay(div, lists[name]["anchor"]);

            if (!exists) {
                li.append(div);
                ul.append(li);
            }
        });
        return ul;
    }
    return null;
};

$(function(){
	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		success: function(data) {
			var contents = $(data).children("ListBucketResult").children("Contents");
			$("#extracts").html(contentsToList(contents));
            $('#search_input').fastLiveFilter('#extracts ul').focus();
		},
		error: function(request, status, error) {
			$("#extracts").html(request.responseText)
		}
	});

    $('body').on('click', 'a.metro-format', function() {
      var $this = $(this);
      var name  = $this.data("name");
      var format= $this.data("format");
      ga('send', 'event', name, 'click', format);
    });

});
