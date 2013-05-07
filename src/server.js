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
            next('ERROR!')
        } else { next(); }
    };
};

// Set 'server' name
connect.errorHandler.title = 'Shepherd';

module.exports = function (opts) {

    var app = connect()
        .use(connect.logger({ stream: opts.logger }))
        .use(purgatory(opts.whitelist).bless())
        .use(middleware.methodFilter(opts.methods || 'POST'))
        .use(connect.bodyParser())
        .use(function (req, resp, next) {
            console.log('wtf=>', exports.title)
            next();
        })
        .use(connect.errorHandler({showStack: true}));

    return http.createServer(app);
};
