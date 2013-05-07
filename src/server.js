var http = require('http'),
    connect = require('connect'),
    purgatory = require('connect-purgatory'),
    server, middleware = {};


middleware.payload = function () {};

middleware.methodFilter = function (methods) {
    methods = [].concat(methods).map(function (method) {
        return method.toUpperCase();
    });

    return function (req, resp, next) {
        if (methods.indexOf(req.method) === -1) {
            resp.statusCode = 403;
            next('Forbidden');
        } else { next(); }
    };
};

// Set 'server' name
connect.errorHandler.title = 'Shepherd';

module.exports = function (opts) {

    var app = connect()
        .use(connect.logger({ stream: opts.logger }))
        .use(middleware.methodFilter(opts.methods))
        .use(purgatory(opts.whitelist).bless())
        .use(connect.bodyParser())
        .use(connect.errorHandler());

    return http.createServer(app);
};
