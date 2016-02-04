var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  // siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  loading: path.join(__dirname, '../web/public/loading.html'),
  index: path.join(__dirname, '../web/public/index.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    var list = data.split('\n');
    list.pop();
    callback(list);
  });
};

exports.isUrlInList = function(targetUrl, callback) {
  exports.readListOfUrls(function(data) {
    callback(data.indexOf(targetUrl) > -1);
  });
};

exports.addUrlToList = function(url, callback, res) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    if (err) throw err;
    fs.readFile(exports.paths.loading, function(err, data) {
      callback(res, data, 302);
    });
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, fs.F_OK, function(err) {
    callback(!err);
  });
};

exports.downloadUrls = function(urlArray) {
  _.each(urlArray, function(url) {
    var filePath = exports.paths.archivedSites + '/' + url;
    var file = fs.createWriteStream(filePath);
    
    http.get( "http://"+url , function(res) {
      res.pipe(file);
    });
  });
};
