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

      _.each(data.databases, function(databaseData, index) {
        // TODO: make not n^2
        var existingMenuItem = _.filter(self.databases, function(databaseMenuItem) {
          return databaseMenuItem.name === databaseData.name;
        })[0];

        if (existingMenuItem) {
          existingMenuItem.updateConfig(databaseData);
        } else {
          self.databases.push(new DatabaseMenuItem(databaseData));
        }
      });
    }, "json");
  };

  self.fetchDatabases();
}

function DatabaseMenuItem(config) {
  var self = this;
  self.showCollections = ko.observable(false);
  self.collections = ko.observableArray();

  self.toggleShowCollections = function () {
    self.showCollections(!self.showCollections());

    if (self.showCollections) {
      self.fetchCollections();
    }
  };

  self.fetchCollections = function () {
    console.log("fecthingColleftions")
    $.post("/getCollections", {database: self.name}, function(data) {
      if (!data) {
        console.error("Fetch collections for " + self.name + " failed");
        return;
      }

      self.collections.removeAll();
      _.each(data, function(collectionName, index) {
        self.collections.push({name: collectionName});
      });
    });
  };

  self.updateConfig = function (config) {
    self.name = config.name;
    self.sizeOnDisk = config.sizeOnDisk;
  };

  self.updateConfig(config);
}


$(document).ready(function() {
  ko.applyBindings(new MainViewModel());
});