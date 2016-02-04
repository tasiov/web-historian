// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var archive = require('./archive-helpers');

exports.updateArchive = function() {
  // get array of urls from our list
  archive.readListOfUrls(function(urlArray){
    // for each url
    _.each(urlArray, function(url) {
      // check if url is archived
      archive.isUrlArchived(url, function(isArchived) {
        if (!isArchived) {
          archive.downloadUrls([url]);
        }
      });
    });
  });
};
