var http = require('http'),
    connect = require('connect'),
    purgatory = require('connect-purgatory'),
    server, middleware = {};


middleware.payload = function () {};


module.exports = function (opts) {

    var connec = connect()
        .use(connect.logger())
        .use(connect.bodyParser())
        .use(connect.errorHandler())
        .use(purgatory(opts.whitelist).bless())
        .use(function (req, resp, next) {
            req.emit('filed');
            next();
        });

    var server = http.createServer(connec);

    server.on('filed', function (req, resp) {
        console.log(req, resp);
        this.emit('files!!!!!1')
    });

    return server;
};

