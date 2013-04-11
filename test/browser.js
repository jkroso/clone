var mocha = require('mocha')

mocha.setup('bdd')

require('./clone.test.js')

mocha.run(function () {
	console.log('Done!')
})
