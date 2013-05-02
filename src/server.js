var http = require('http'),
    connect = require('connect'),
    server, middleware = {};

middleware.whitelist = function (ips) {

    ips = ips || [];

    var remoteAddress = function (req) {
        var sock = req.socket;
        if (req.ip) { return req.ip; }
        if (sock.socket) return sock.socket.remoteAddress;
        return sock.remoteAddress;
    };

    return function (req, resp, next) {
        if (ips.length === 0 || ips.indexOf(remoteAddress(req)) !== -1) {
            req.whitelisted = true;
            next();
        } else {
            resp.statusCode = 403;
            next('Remote address doesn\'t match whitelisted addresses.');
        }
    };
};

middleware.payload = function () {};


var cdir = function (ip, suffix) {
    var ones = new Array(suffix + 1).join(1).split(''),
        zeros = new Array((32 - suffix) + 1).join(0).split(''),
        bits = ones.concat(zeros),
        address = '';

    while (bits.length) {
        console.log(bits);
        address += parseInt(bits.splice(0, 8).join(''), 2);
        address += '.';
        console.log(address);
    }

    return address;
};


server = connect()
    .use(connect.logger())
    .use(connect.bodyParser())
    .use(connect.errorHandler())
    .use(middleware.whitelist(['127.0.0.1']))
    .use(function (req, resp, next) {
        resp.end();
    });

module.exports = function (options) {
    console.log(options)
    return http.createServer(server);
};
