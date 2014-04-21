var url = "https://s3.amazonaws.com/metro-extracts.mapzen.com";

var contentsToList = function (contents){
    if (contents.length > 0)
    {
        var ul = $('<ul/>');
        contents.each(function(){
            var $this = $(this);
            var key   = $this.children('key').text()
            var li 	  = $('<li/>');
            var a     = $('<a/>',{
                text: key,
                href: url + "/" + key
            });
            li.append(a);
            ul.append(li);
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
		},
		error: function(request, status, error) {
			$("#extracts").html(request.responseText)
		}
	});
});