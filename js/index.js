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

var displayReadableFormat = function(format) {
    var formats = ['imposm-shapefiles.zip', 'osm.bz2', 'osm.pbf', 'osm2pgsql-shapefiles.zip'];
    var readable= ['IMPOSM', 'OSM XML', 'OSM PBF', 'OSM2PGSQL(.shp)'];
    return readable[formats.indexOf(format)] || undefined;
};

var displayReadableDate = function(date) {
    $("#last_updated_at").html(getReadableDate(date));
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
            if (key == 'LastUpdatedAt') {
                displayReadableDate($this.children('LastModified').text());
                return true;
            }
            var name  = key.substring(0,key.indexOf('.'));
            var format= key.substring(key.indexOf('.')+1);
            var exists= lists.hasOwnProperty(name);
            var li    = $('<li/>');
            var div   = $("<div/>");

            var last_modified = $this.children('LastModified').text();

            if (exists) {
                li  = lists[name]["li"];
                div = lists[name]["div"];

            } else {
                lists = [];
                li.addClass(name);
                li.append("<h5 class ='place_name'>" + name.replace(/-/g, ' ') + "</h5>");
                div.addClass("btn-group");
                lists[name] = {"li":li, "div":div};
            }

            var a     = $('<a/>',{
                text: displayReadableFormat(format) + " (" + getReadableFileSize(size) + ")",
                href: url + "/" + key
            });
            a.addClass("btn btn-default format");
            div.append(a);
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
});
