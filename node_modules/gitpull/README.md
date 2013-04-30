# gitpull - fetch from and merge with another branch

[![Build Status](https://secure.travis-ci.org/michaelnisi/gitpull.png)](http://travis-ci.org/michaelnisi/gitpull)

## Description

Incorporate changes from a remote repository into the current branch.

## Usage

### Stream

    var gitpull = require('gitpull')

    gitpull('.')
      .on('error', function (err) {
        console.error(err.message)
      })
      .on('end', function () {
        console.log('OK')
      })

### Callback
    
    var gitpull = require('gitpull')

    gitpull('.', function (err) {
      err ? console.error(err.message) : console.log('OK')  
    })

## Installation

install via [npm](http://npmjs.org/):

    npm install gitpull

## License

[MIT License](https://raw.github.com/michaelnisi/gitpull/master/LICENSE)
