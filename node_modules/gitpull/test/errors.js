var test = require('tap').test
  , fs = require('fs')
  , rimraf = require('rimraf')
  , join = require('path').join
  , dir = '/tmp/gitpull-' + Math.floor(Math.random() * (1<<24))
  , spawn = require('child_process').spawn
  , gitpull = require('../index.js')

test('setup', function (t) {
  fs.mkdirSync(dir, 0700)
  process.chdir(dir)
  t.end()
})

test('Not a git repository', function (t) {
  var errors = []
  
  gitpull(dir)
    .on('error', function (err) {
      errors.push(err)
    })
    .on('end', function () {
      t.ok(errors.length > 0, 'should contain errors')
      t.end()
    })
})

test('git init', function (t) {
  var ps = spawn('git', ['init'])
  
  ps.stderr.pipe(process.stderr, { end:false })
  ps.on('exit', function () {
    t.ok(true, 'init should be ok')
    t.end()    
  })
})

test('No remote repository specified', function (t) {
  var errors = []
  
  gitpull(dir)
    .on('error', function (err) {
      errors.push(err)
    })
    .on('end', function () {
      t.ok(errors.length > 0, 'should contain errors')
      t.end()
    })
})

test('teardown', function (t) {
  rimraf(dir, function (err) {
    fs.stat(dir, function (err) {
      t.ok(!!err, 'should error')
      t.end()
    })
  })
})
