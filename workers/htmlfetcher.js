// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');
var crontab = require('node-crontab');

exports.crontab = function() {
  crontab.scheduleJob("*/1 * * * *", function(){ //This will call this function every 2 minutes 
      _updateArchive();
  });
};

var _updateArchive = function() {
  archive.readListOfUrls(function(urlArray){
    _.each(urlArray, function(url) {
      archive.isUrlArchived(url, function(isArchived) {
        if (!isArchived) {
          archive.downloadUrls([url]);
        }
      });
    });
  });
};