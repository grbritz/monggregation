function MainViewModel() {
  var self = this;
    
  self.databaseMenu = new DatabaseMenu();
  
}

function DatabaseMenu () {
  var self = this;

  self.databases = ko.observableArray();
  self.fetchDatabases = function () {
    $.post("/api/databases", {}, function(data) {
      if (! data || ! data.hasOwnProperty('databases')) {
        console.error('Databases fetch failed: ', data);
        return;
      }

      // TODO: Something not as abrasive
      self.databases.removeAll();

      _.each(data.databases, function(database, index) {
        self.databases.push(database);
      });
    }, "json");
  };


  self.fetchDatabases();
}


$(document).ready(function() {
  ko.applyBindings(new MainViewModel());
});