// Dependencies
var fs      = require('fs'),
    nconf   = require('nconf'),
    fsutil  = require('fsutil'),
    request = require('request'),
    server  = require('./src/server.js'),
    Git     = require('./src/git.js'),
    Log     = require('log'),
    log;

// Read all config options
nconf.argv()
    .env()
    .file({ file: 'config.json' })
    .defaults({
        log: 'shepherd.log',
        port: 3000,
        whitelist: 'GitHub',
        methods: 'POST'
    });

// Either set log to output to stdout or to a log file
log = (process.env.NODE_DEBUG) ?
        new Log('debug') :
        new Log('notice', (function () {
            // create the file if it doesn't exist
            fsutil.fwrite_p(nconf.get('log'), '');
            return fs.createWriteStream(nconf.get('log'));
        }()));

// Set 'server' name
exports.title = 'Shepherd';


function init() {
    log.notice('Starting shepherd server on port: %s', nconf.get('port'));
    server({
        whitelist: nconf.get('whitelist'),
        methods: nconf.get('methods'),
        logger: log.stream
    }).listen(nconf.get('port'));
}

// If the user specified that he wanted to use the GitHub hooks
// let's get them first
if (nconf.get('whitelist') && nconf.get('whitelist').toLowerCase() === 'github') {

    log.notice('Requesting GitHub hooks');
    Git.meta(function (err, data) {
        if (err) {
            log.error('Could not request GitHub hooks %s', err);
            throw err;
        }

        log.notice('Requested GithHub hooks %s', JSON.stringify(data.hooks));
        nconf.set('whitelist', data.hooks);
        init();
    });

} else { init(); }
