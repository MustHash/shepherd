// Dependencies
var nconf   = require('nconf'),
    gith    = require('gith').create(nconf.get('port')),
    gitpull = require('gitpull'),
    fs      = require('fs'),
    Log     = require('log'),
    log, pull;

// Read configurations in order
//  1. Command-Line
//  2. Enviromental variable
//  3. A configuration file
nconf.argv()
    .env()
    .file({ file: 'config.json' });

// Create a logger that will write on the specified file
log = new Log('debug', fs.createWriteStream(nconf.get('log')));

// Function that will make the `git pull`
pull = function (payload, cb) {
    gitpull(nconf.get('repository-folder')).on('end', function () {
        log.info('pulled: ', JSON.stringify(payload));
        if (cb && typeof cb === 'function') { cb(); }
    });
};

// Githook server that will listen on the specified port
gith({
    repo: nconf.get('repository'),
    branch: nconf.get('branch')
}).on('all', pull).on('error', function (err) { log.error(err); });
