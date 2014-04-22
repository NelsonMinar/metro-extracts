var url = "https://s3.amazonaws.com/metro-extracts.mapzen.com";

var contentsToList = function (contents){
    if (contents.length > 0)
    {
        var ul = $('<ul/>');
        var lists     = [];
        contents.each(function(){
            var $this = $(this);
            var key   = $this.children('key').text();
            var name  = key.substring(0,key.indexOf('.'));
            var format= key.substring(key.indexOf('.')+1);

            var exists= lists.hasOwnProperty(name);
            var li    = $('<li/>');
            if (exists) {
                li = lists[name];
            } else {
                lists = [];
                li.addClass(name);
                li.append("<span class ='place_name'>" + name + "</span>");
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