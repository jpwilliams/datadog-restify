# datadog-restify

Datadog middleware for Restify. Based on (and conciously replicating) [node-connect-datadog](github.com/AppPress/node-connect-datadog).

## Usage

Add middleware immediately before your router.

``` js
  app.use(require('datadog-restify')({}))
  app.use(app.router)
```

## Options

All options are optional.

* `dogstatsd` node-dogstatsd client. `default = new (require('node-dogstatsd')).StatsD()`
* `stat` *string* name for the stat. `default = 'node.express.router'`
* `tags` *array* of tags to be added to the histogram. `default = []`
* `path` *boolean* include path tag. `default = false`
* `method` *boolean* include http method tag. `default = false`
* `protocol` *boolean* include protocol tag. `default = false`
* `response_code` *boolean* include http response codes. `default = false`

## License

View the [LICENSE](https://github.com/jpwilliams/datadog-restify/blob/master/README.md) file.

