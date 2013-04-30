var gitpull = require('../index.js')

gitpull('.', function (err) {
  err ? console.error(err) : console.log('OK')  
})
