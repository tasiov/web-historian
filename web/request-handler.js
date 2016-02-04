var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var url = require('url');

exports.handleRequest = function (req, res) {
  actions[req.method](req, res);
};

var actions = {
  'GET' : function (req, res) {
    var path = url.parse(req.url).pathname;
    
    if (path === '/') {
      path = archive.paths.index;
    } else {
      path = archive.paths.archivedSites + path;
    }

    fs.access(path, fs.F_OK, function(err) {
      if (!err) {
        httpHelpers.readFile(path, res);   
      } else {
        httpHelpers.serveAssets(res, '', 404);
      }
    });
  },

  'POST' : function (req, res) {
    httpHelpers.collectData(req, function(data) {
      var url = data.slice(4);
      archive.isUrlArchived(url, function(isArchived) {
        if (isArchived) {
          httpHelpers.readFile(archive.paths.archivedSites + '/' + url, res);
        } else {
          archive.addUrlToList(url, httpHelpers.serveAssets, res);
          // archive.downloadUrls([url]);
        }
      });
    });
  }
};
