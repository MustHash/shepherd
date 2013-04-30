var fs      = require('fs'),
    forever = require('forever-monitor'),
    nconf   = require('nconf'),
    gith    = require('gith'),
    gitpull = require('gitpull');


// Read configurations in order
//  1. Command-Line
//  2. Enviromantal variable
//  3. A configuration file


