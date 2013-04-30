var gitpull = require('../index.js')

gitpull('.')
  .on('error', function (err) {
    console.error(err.message)
  })
  .on('end', function () {
    console.log('OK')
  })
  .pipe(process.stdout)
