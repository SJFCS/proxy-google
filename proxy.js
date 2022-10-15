'use strict';
 
var http = require('http');
var https = require('https');
var httpProxy = require('http-proxy');
var url = require('url');
 
var PROXY_PORT = 9000;
var proxy, server;
 
// Create a proxy server with custom application logic
proxy = httpProxy.createProxy({});
 
proxy.on('error', function (err) {
    console.log('ERROR');
    console.log(err);
});
 
server = http.createServer(function (req, res) {
    //var finalUrl = req.url,
    var finalUrl = 'https://www.google.com.hk';
    var finalAgent = null;
    var parsedUrl = url.parse(finalUrl);
    
    console.log(' ' + new Date().getTime() );
 
 
    if (parsedUrl.protocol === 'https:') {
        finalAgent = https.globalAgent;
    } else {
        finalAgent = http.globalAgent;
    }
 
    proxy.web(req, res, {
        target: finalUrl,
        agent: finalAgent,
        headers: { host: parsedUrl.hostname },
        prependPath: false,
        xfwd : true,
        hostRewrite: finalUrl.host,
        protocolRewrite: parsedUrl.protocol
    });
});
 
console.log('listening on port ' + PROXY_PORT);
server.listen(PROXY_PORT);
