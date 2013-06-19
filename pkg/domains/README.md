These are the example applications meant for use in the domains workshop for
NodeConf 2013. All of them have things wrong with them. Your task is to figure
out how to use domains to make them crash less and tell you more when they do
crash.

If you don't have curl available, run

```shell
cd express-middleware
npm -g install node_modules/uncurled
```

Good luck!

Forrest & Domenic

## The examples

* `crashy-server`: A RESTful CaaS (crashing as a service) application.
* `express-middleware`: Harmonizing domains with Express's error handling.
* `pow-server`: Working with pooled connections and domains is a little tricky.
