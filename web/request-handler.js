var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var url = require('url');

exports.handleRequest = function (req, res) {
  // res.end(archive.paths.list);
  actions[req.method](req, res);
};


var actions = {
  'GET' : function (req, res) {
    var path = url.parse(req.url).pathname;
    
    if (path === '/') {
      path = archive.paths.siteAssets + '/index.html';
    } else {
      path = archive.paths.archivedSites + path;
    }

    fs.access(path, fs.F_OK, function(err) {
      if (!err) {
        fs.readFile(path, function(err, data) {
          httpHelpers.sendResponse(res, data);
        });    
      } else {
        httpHelpers.sendResponse(res, '', 404);
      }
    });
  },

  'POST' : function (req, res) {
    httpHelpers.collectData(req, function(data) {
      archive.addUrlToList(data.slice(4), httpHelpers.sendResponse, res);
    });
  }
};
