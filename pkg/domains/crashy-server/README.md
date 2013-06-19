# Domains Session: Crashy Server Kata

`server.js` contains the code for a rather fragile server. Every time something goes wrong, the entire server crashes,
and it's no longer available to anyone—oh no!

**Your mission is to make it so that instead of crashing, when something goes wrong the user gets a nice 500 error
page with a stack trace.**

But first, you must understand what the server does.

## Endpoints

Start up the server by running `npm start` from this directory. Then you'll be able to poke and prod at the following:

### GET /throw

Accessing this route will simply throw an error. This should provide a nice easy test case to help you understand how
fatal uncaught exceptions are to Node.js servers. Try it out with

```
$ uncurl -i http://localhost:1337/throw
```

### POST /sum-numbers

If you post a JSON array of numbers, it will respond with the sum. Try it:

```
$ uncurl -X POST --data-json="[1, 2, 3]" -i http://localhost:1337/sum-numbers
```

Can you see how you might be able to crash the server using this route? Looking at the code is allowed!

### GET /file?name=...

If you pass a file name, relative to the server directory, this route will print out its contents as a text/plain
response. Try printing `server.js` itself, for example

```
$ uncurl -i http://localhost:1337/file?name=server.js
```

There's a different type of crash hidden here. How will you trigger it?

## The goal

After you've figured out how to make every endpoint crash, we need to fix this situation! A single user should not be
able to take down our entire server!

Right now, if you hit the `throw` endpoint, here's what happens:

```
$ uncurl -i http://localhost:1337/throw
uncurled barfed: read ECONNRESET
```

The server crashed, resetting our connection and abruptly disconnecting not only this user, but any other users trying
to contact our server. How rude.

What we want is something more like this:

```
$ uncurl -i http://localhost:1337/throw
HTTP/1.1 500 Server Error
content-type: text/plain
date: Wed, 19 Jun 2013 06:10:33 GMT
connection: keep-alive
transfer-encoding: chunked

We encountered an error!

Error: Pretend I am deeply nested inside library code!
    at c:\Users\Domenic\Dropbox\Programming\GitHub\nodeconf2013\pkg\domains\katas\1-crashy-server\server.js:34:13
    at b (domain.js:183:18)
    at Domain.run (domain.js:123:23)
    at Server.<anonymous> (c:\Users\Domenic\Dropbox\Programming\GitHub\nodeconf2013\pkg\domains\katas\1-crashy-server\server.js:20:5)
    at Server.EventEmitter.emit (events.js:98:17)
    at HTTPParser.parser.onIncoming (http.js:2012:12)
    at HTTPParser.parserOnHeadersComplete [as onHeadersComplete] (http.js:119:23)
    at Socket.socket.ondata (http.js:1902:22)
    at TCP.onread (net.js:510:27)
```

And of course, after sennding back this 500, the server should keep running so that other people can use it.

Make it so!
