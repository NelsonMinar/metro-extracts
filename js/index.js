var url = "https://s3.amazonaws.com/metro-extracts.mapzen.com";

var getReadableDate= function (date) {
    var d = new Date(date);
    var r = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    return "Last Updated at <span class='datetime'>" + r + "<span>";
}

var displayReadableDate = function(date) {
    $("#last_updated_at").html(getReadableDate(date));
}
var contentsToList = function (contents){
    if (contents.length > 0)
    {
        var ul = $('<ul/>');
        var lists     = [];
        contents.each(function(){
            var $this = $(this);
            var key   = $this.children('key').text();
            if (key == 'LastUpdatedAt') {
                displayReadableDate($this.children('LastModified').text());
                return true;
            }
            var name  = key.substring(0,key.indexOf('.'));
            var format= key.substring(key.indexOf('.')+1);
            var exists= lists.hasOwnProperty(name);
            var li    = $('<li/>');

            var last_modified = $this.children('LastModified').text();

            if (exists) {
                li = lists[name];
            } else {
                lists = [];
                li.addClass(name);
                li.append("<span class ='place_name'>" + name.replace(/-/g, ' ') + "</span>");
                lists[name] = li;
            }

            var a     = $('<a/>',{
                text: format,
                href: url + "/" + key
            });
            a.addClass("format");
            li.append(" ");
            li.append(a);
            if (!exists) {
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
            $('#search_input').fastLiveFilter('#extracts ul');
		},
		error: function(request, status, error) {
			$("#extracts").html(request.responseText)
		}
	});
});