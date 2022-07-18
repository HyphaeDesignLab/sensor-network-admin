// from https://nodejs.org/en/knowledge/HTTP/servers/how-to-serve-static-files/
var static = require('node-static');
var http = require('http');

var file = new(static.Server)(__dirname+'/../public/');

http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(8002);