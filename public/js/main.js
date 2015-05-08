function MainViewModel() {
  var self = this;
    
  self.databaseMenu = new DatabaseMenu();
  self.activeCollection = ko.observable(false);

  self.showCollection = function(database, collection) {
    self.activeCollection(false);

    $.post('/api/getSchema',  
      {collection: collection.name, database: database.name}, 
      function(schema) {
        if (!schema) {
          console.error("Could not get schema for " + database.name + "." + collection.name);
          return;
        }

        self.activeCollection(new CollectionViewModel({
          name : collection.name,
          databaseName : database.name,
          schema : schema
        }))
      });
  };

  self.hideCollection = function (argument) {
    self.activeCollection(false);
  };
}


function CollectionViewModel(config) {
  var self = this;
  self.name = ko.observable("");
  self.databaseName = ko.observable("");
  self.schema = ko.observable(null);

  self.prettySchema = ko.computed(function() {
    return JSON.stringify(self.schema(), null, 2);
  });

  self.updateConfig = function (config) {
    self.name(config.name);
    self.databaseName(config.databaseName);
    self.schema(config.schema);
  };

  self.updateConfig(config);
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
    $.post("/api/getCollections", {database: self.name}, function(data) {
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