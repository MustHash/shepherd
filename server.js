// Dependencies
var nconf   = require('nconf'),
    gith    = require('gith'),
    gitpull = require('gitpull'),
    fs      = require('fs'),
    Log     = require('log'),
    log, pull, server;

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
    log.debug('Going to pull.');
    gitpull(nconf.get('repository-folder')).on('end', function () {
        log.info('Git pulled completed: ' + nconf.get('repository-folder') + ' => ', JSON.stringify(payload));
        if (cb && typeof cb === 'function') { cb(); }
        if (nconf.get('post-script')) {
            var post = require(nconf.get('post-script'));
            if (typeof post === 'function') { post(payload); }
        }
    }).on('error', function (err) {
        log.error('Error during git pull:' + err.message);
    });
};

// Githook server that will listen on the specified port
server = gith.create(nconf.get('port'));

server({
    repo: nconf.get('repository'),
    branch: nconf.get('branch')
}).on('all', pull).on('error', function (err) { log.error(err); });

// Notify
log.debug('Started shepherd server.', fs.readFileSync('config.json'));
