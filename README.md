# proxy-google

## 编写 Nodejs 反向代理服务
`npm install --save http-proxy `

`vim proxy.js`

```js
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

```

运行 `node proxy.js` 访问 `http://localhost:9000/`  验证结果
## vercel 部署
`npm install -g vercel`

`vim vercel.json` 

```json
{
   "version": 2,
   "name": "proxy-google",
   "builds": [
      { "src": "proxy.js", "use": "@vercel/node" }
   ],
   "routes": [
      { "src": "/(.*)", "dest": "/proxy.js" }
   ]
}
```

`vercel -A vercel.json --prod`

