You can use `npm start` to run the Express service (read the source for the
available routes).

## ./domain-errors.js

Write your domain-aware error-handling middleware in domain-errors.js. This
middleware is intended to work with code you've written that creates and
manages its own domains. This makes sense if you want to have custom
presentation for errors on a per-handler (or per-router) basis.

## ./domainifier.js

Write your middleware to ensure that every request is run in a domain in
`domainifier.js`. This middleware goes at the *beginning* of your middleware
chain, and works well with the built-in Connect error-handling middleware,
which goes at the *end* of the middleware chain:

```javascript
app.use(domainifier);
// .. other middleware
app.use(express.errorHandler());
```

Don't use both domainifier and domainErrors at the same time. If you try, good
luck figuring out what's happening inside your application.
