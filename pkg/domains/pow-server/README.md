This folder includes a simple proof-of-work server (think Bitcoin miners, but
totally dumbed down). Because (we're going to pretend) creating connections to
the server is so expensive, there's a front-end web server that uses a
connection pool to talk to the back-end prover. Using domains with connection
pools is tricky, so most of the action will happen (at least at first) in
getting domains to work with the front-end web server in `server.js`. The
entire package -- front-end server, connection pool, and proof-of-work server
-- can be run either via `npm start` or `node server.js`.

To make things more interesting, various bits of the pool and the prover have
been configured to randomly crash. The crashing isn't particularly safe, so you
may have to clean up some leftover Node processes. Consider this additional
encouragement to get the domains support in there and functional as quickly as
possible.

To (attempt to) submit a chunk of input to the server for computation, run
something like

`uncurl -i -d ham -X POST http://localhost:8080/`

If it doesn't crash and burn (and the odds aren't good), you'll get back
something like the following:

```json
{"input":"ham","proof":"2089cd"}
```

If you want to verify that the proof is valid and you have shasum (and a
sh-like shell) installed, run:

`echo -n ham2089cd | shasum -a256`

That is to say, the concatenation of the input with the generated proof is fed
into SHA256. If the proof is correct, the last 5 hex digits of the hash will be
`beefd`.  Yes.

The code is laid out like so:

* `pow.js`: the prover. Uses `cluster` to manage a pool of individual provers
  and already has *some* domains support built in. Can be run alone. Listens on
  port 1337.
* `pooled-pow.js`: the connection pool to the back-end server. Runs inside the
  front-end web server.
* `server.js`: the front-end web service. Listens on port 8080.
