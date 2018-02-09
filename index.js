const DD = require('node-dogstatsd').StatsD

module.exports = function (options) {
  const host = options.host || 'localhost'
  const port = options.port || 8125
  const datadog = options.dogstatsd || new DD(host, port)

  const stat = options.stat || 'node.express.router'
  const tags = options.tags || []
  const path = options.path || false
  const baseUrl = options.base_url || false
  const responseCode = options.response_code || false

  return function (req, res, next) {
    if (!req._startTime) {
      req._startTime = new Date()
    }

    let end = res.end

    res.end = function (chunk, encoding) {
      res.end = end
      res.end(chunk, encoding)

      if (!req.route || !req.route.path) {
        return
      }

      var reqBaseUrl = (baseUrl !== false) ? req.baseUrl : ''

      var statTags = [
        `route:${reqBaseUrl}${req.route.path}`
      ].concat(tags)

      if (options.method) {
        statTags.push(`method:${req.method.toLowerCase()}`)
      }

      if (options.protocol && req.protocol) {
        statTags.push(`protocol:${req.protocol}`)
      }

      if (path !== false) {
        statTags.push(`path:${reqBaseUrl}${req.path()}`)
      }

      if (responseCode) {
        statTags.push(`response_code:${res.statusCode}`)
        datadog.increment(`${stat}.response_code.${res.statusCode}`, 1, statTags)
        datadog.increment(`${stat}.response_code.all`, 1, statTags)
      }

      datadog.histogram(`${stat}.response_time`, (new Date() - req._startTime), 1, statTags)
    }

    next()
  }
}
