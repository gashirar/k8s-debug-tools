// HTTPエコーサーバー HTTPリクエストボディデータを返す
let http = require('http');
let server = http.createServer();
let port = process.env.SERVER_PORT || 80;

let LIVENESS_STATUS = process.env.LIVENESS_STATUS || 200;
let READINESS_STATUS = process.env.READINESS_STATUS || 200;

// クライアントからリクエストボディデータをレスポンスとして返す
server.on('request', function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });

    req.on('end', function () {
        switch (req.url) {
            case '/liveness':
                res.writeHead(LIVENESS_STATUS, {'Content-Type': 'application/json'});
                break;
            case '/readiness':
                res.writeHead(READINESS_STATUS, {'Content-Type': 'application/json'});
                break;
            default:
                res.writeHead(200, {'Content-Type': 'application/json'});
                break;
        }
        res.end(JSON.stringify({
            "body": data,
            "env": {
                "K8S_UID":                  process.env.K8S_UID                  || "<undefined>",
                "K8S_NODE_NAME":            process.env.K8S_NODE_NAME            || "<undefined>",
                "K8S_HOST_IP":              process.env.K8S_HOST_IP              || "<undefined>",
                "K8S_POD_NAME":             process.env.K8S_POD_NAME             || "<undefined>",
                "K8S_NAMESPACE":            process.env.K8S_NAMESPACE            || "<undefined>",
                "K8S_POD_IP":               process.env.K8S_POD_IP               || "<undefined>",
                "K8S_SERVICE_ACCOUNT_NAME": process.env.K8S_SERVICE_ACCOUNT_NAME || "<undefined>",
                "K8S_CONTAINER_NAME":       process.env.K8S_CONTAINER_NAME       || "<undefined>",
                "K8S_CPU_REQUEST":          process.env.K8S_CPU_REQUEST          || "<undefined>",
                "K8S_CPU_LIMIT":            process.env.K8S_CPU_LIMIT            || "<undefined>",
                "K8S_MEMORY_REQUEST":       process.env.K8S_MEMORY_REQUEST       || "<undefined>",
                "K8S_MEMORY_LIMIT":         process.env.K8S_MEMORY_LIMIT         || "<undefined>"
            }
        }));
    });
});


// HTTPの生データを出力する
server.on('connection', function (socket) {
    console.log('=== Raw Socket Data Start ===');
    socket.on('data', function (chunk) {
        console.log(chunk.toString());
    });

    socket.on('end', function () {
        console.log('=== Raw Socket Data End ===');
    });
});

// ソケット関連のエラー出力
server.on('clientError', function(e) {
    console.log('Client Error: ', e.message);
});

// サーバ関連のエラー出力
server.on('error', function(e) {
    console.log('Server Error: ', e.message);
});

server.listen(port, function () {
    console.log('listening on ' + port);
})

