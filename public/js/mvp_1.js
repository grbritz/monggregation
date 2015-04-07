$(document).ready(function(){
  $("#query-submit").click(function(){
    
  });

  $(".get-collections").click(function(){
    var databaseName = $(this).attr("id");
    $.post("mvp-1/getCollections?database=" + databaseName, {}, function(data) {
      var $target = $(".collections." + databaseName);
      $.each(data, function(index, collectionName) {
        var $li = $("<li>");
        var $a = $("<a>")
                    .addClass("select-collection")
                    .data("collection-name", collectionName)
                    .text(collectionName);
        $li.append($a);
        $target.append($li);
      });
    });
  });


  $(".select-collection").click(function(){
    

  });
});