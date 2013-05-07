var request = require('request');

function Git() {}

Git.prototype = {

    constructor: Git,

    pull: function () {}

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
