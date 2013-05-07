var http = require('http'),
    connect = require('connect'),
    purgatory = require('connect-purgatory'),
    Git = require('./git.js'),
    server, middleware = {};


middleware.payload = function () {};

// small middleware to allow only requests from the specified methods
middleware.filterMethods = function (methods) {

    var forbidden = function () {
        var err = new Error('Forbidden.');
        err.status = 403;
        return err;
    };

    methods = [].concat(methods).map(function (method) {
        return method.toUpperCase();
    });

    return function (req, resp, next) {
        if (~methods.indexOf(req.method.toUpperCase())) { next(); }
        else { next(forbidden()); }
    };
};

// According to the environment given as an argument
// it will remove the stack from the error object or just proxy it
// to the next middleware
middleware.hideStack = function (env) {
    return function (err, req, resp, next) {
        if (env !== 'development') {
            err.stack = '';
            next(err);
        } else { next(err); }
    };
};

middleware.git = function (opts) {
    return function (req, resp, next) {
        (new Git())
            .cwd(opts['repository-folder'])
            .pull(function (err, data) {
                if (err) { next(err); }
                else { next(); }
            });
    };
}

// Set server's 'name'
connect.errorHandler.title = 'Shepherd';


module.exports = function (opts) {

    server = connect()
        .use(connect.logger({ stream: opts.logger }))
        .use(connect.timeout(opts.timeout))
        .use(middleware.filterMethods(opts.methods))
        .use(purgatory(opts.whitelist).bless())
        .use(connect.json())
        .use(middleware.hideStack(opts.environment))
        .use(middleware.git())
        .use(connect.errorHandler());

    return (server);
};
