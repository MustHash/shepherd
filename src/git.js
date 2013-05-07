var request = require('request'),
    cp      = require('child_process'),
    spawn   = cp.spawn;


function Git() {}

Git.prototype = {

    constructor: Git,

    cwd: function (cwd) {
        this.cwd = cwd;
        return this;
    },

    pull: function (cb) {
        var pull = spawn('git', ['pull'], { cwd: this.cwd }),
            error = '';

        pull.stderr.on('data', function (err) { error += err.toString(); });
        pull.stdout.on('data', function (data) { console.log('git pull data', data.toString()); });
        pull.on('close', function (code) {
            if (!error.length) { error = null; }
            if (cb && typeof cb === 'function') { cb(error, code); }
        });

        return this;
    }

};

Git.meta = function (cb) {

    if (!cb || typeof cb !== 'function') {
        throw Error('A callback function must be passed as an argument');
    }

    return request({
        url: 'https://api.github.com/meta',
        headers: { 'User-Agent': 'shepherd/0.0.1-dev' }
    }, function (err, resp, body) {
        if (err) { cb(err); }
        else { cb(null, JSON.parse(body)); }
    });
};

module.exports = Git;
