$(document).ready(function(){
  $("#query-submit").click(function(){
    
  });

  var selectCollectionClickHandler = function() {
    var collectionName = $(this).data("collection-name");
    var databaseName = $(this).closest("ul").data('database-name');
    $(".schema").text("");
    $(".aggregation-div")
      .removeClass("hide")
      .data("database", databaseName)
      .data("collection", collectionName);
    $(".schema-name").text(collectionName);

    $.post("/getSchema", 
      {collection: collectionName, database: databaseName}, 
      function(data) {
        console.log(data);
        $(".schema").text(JSON.stringify(data, null, 2));
      }
    );

  };

  var querySubmitHandler = function() {
    var collectionName = $(this).closest(".aggregation-div").data("collection");
    var databaseName = $(this).closest(".aggregation-div").data("database");
    var query = $("#query-pane").val();
    $.post("/runQuery", 
      {
        database: databaseName,
        collection: collectionName,
        query: query
      }, function(result) {
        console.log(result);
        $(".query-results-container").removeClass("hide");
        $(".query-results").text(JSON.stringify(result, null, 2));
      });
  };

  $("#query-submit").click(querySubmitHandler);

  $(".get-collections").click(function(){
    var databaseName = $(this).attr("id");
    $.post("/getCollections", {database: databaseName}, function(data) {
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

  var myCodeMirror = CodeMirror(document.body, {
    value: "write query here...\n",
    mode:  "javascript"
  });
  

});
