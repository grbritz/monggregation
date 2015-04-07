$(document).ready(function(){
  $("#query-submit").click(function(){
    
  });

  var selectCollectionClickHandler = function() {
    var collectionName = $(this).data("collection-name");
    var databaseName = $(this).closest("ul").data('database-name');
    console.log(databaseName);
    console.log(collectionName);

    $.post("mvp-1/getSchema", 
      {collection: collectionName, database: databaseName}, 
      function(data) {
        console.log(data);
        $(".schema").text(JSON.stringify(data));
      }
    );

  };

  $(".get-collections").click(function(){
    var databaseName = $(this).attr("id");
    $.post("mvp-1/getCollections", {database: databaseName}, function(data) {
      var $target = $(".collections." + databaseName);
      $.each(data, function(index, collectionName) {
        var $li = $("<li>");
        var $a = $("<a>")
                    .attr("href" , "#")
                    .addClass("select-collection")
                    .data("collection-name", collectionName)
                    .text(collectionName)
                    .click(selectCollectionClickHandler);
        $li.append($a);
        $target.append($li);
      });
    });
  });

  


});