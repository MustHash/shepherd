// Dependencies
var nconf   = require('nconf'),
    request = require('request'),
    server  = require('./src/server.js');

// Read all config options
nconf.argv()
    .env()
    .file({ file: 'config.json' });

// GithHub may change their hooks IP range so we need to fetch it first
console.log('Requesting GitHub hooks');
request({
    url : 'https://api.github.com/meta',
    headers: { 'User-Agent': 'shepherd/0.0.1 (dev)' }
}, function (error, response, body) {
    if (error) { throw error; }
    console.log('Successfully obtained GitHub hooks');
    server({ whitelist: JSON.parse(body).hooks }).listen(3000);
});

