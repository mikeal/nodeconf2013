You need to URL encode a stream you're sending to a web server somewhere. You
want this:

```javascript
var fs = require('fs');
var request = require('request');
var URLEncodeStream = require('urlencode-stream');
var handler = require('./response-handler');


fs.createReadStream('./sample-data.txt')
  .pipe(new URLEncodeStream())
  .pipe(request('http://example.com/postme', handler));
```

Depends on streams2, one way or another. If you're running 0.10.x, it'll use
the built-in streams. If you're running Node 0.8.x, it'll use
`readable-stream`. If you're running an earlier Node, you're outta luck, chum.
Maybe it's time to upgrade?
