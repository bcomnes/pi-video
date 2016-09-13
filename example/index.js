var minimist = require('minimist')
var morgan = require('morgan')
var Hyperserv = require('../')
var app = new Hyperserv()
var argv = minimist(process.argv.slice(2), {
  alias: { p: 'port' },
  default: { port: 8000 }
})

process.title = 'hyperserv'

// Reconfigure the middlewre stack sitting in front of the routes.
app.composeStack([
  morgan('dev')
])

// Set up routes
app.router.set('/', function (req, res, opts, cb) {
  res.end('hi')
})

// Set up routes
app.router.set('/:name', function (req, res, opts, cb) {
  res.end('hello ' + opts.params.name)
})

// Routes can fly fast and loose.  It don't matter
app.router.set('/crash', function (req, res, opts, cb) {
  throw new Error('This route crashed intentionally')
})

function expressMiddleware (req, res, next) {
  res.write(JSON.stringify(req.opts) + '\n')
  res.end('this is an express/connect style middleware layer')
}

app.router.set('/:name/express', Hyperserv.makeRoute(expressMiddleware))

app.httpServer.listen(argv.port)