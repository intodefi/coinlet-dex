var TestRunner = require('test-runner')
var tool = require('../')
var a = require('core-assert')

var runner = new TestRunner()

runner.test('.getCli', function(t){
  var definitions = [
    { name: 'yeah', type: String }
  ]
  var sections = [
    { header: 'Yeah', content: 'Test' }
  ]
  var cli = tool.getCli(definitions, sections, [ '--yeah', 'test' ])
  a.deepEqual(cli.options, { yeah: 'test' })
  a.ok(/Test/.test(cli.usage))
})
