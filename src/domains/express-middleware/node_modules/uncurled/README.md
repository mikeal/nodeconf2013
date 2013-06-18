Like `curl`, but does way less. Runs anywhere Node.js does.

```
Usage: uncurl [options...] <url>

Options:
  -i, --include  Include protocol headers in the output  [boolean]
  -X, --request  Specify request command to use          [string]  [default: "GET"]
  -d, --data     HTTP POST data                          [string]
  --data-ascii   HTTP POST ASCII data                    [string]
  --data-binary  HTTP POST binary data                   [string]
  --data-json    HTTP POST JSON data                     [string]
```

*NOTE:* for the long parameters, if you want to read from standard input,
you'll need to invoke the option like so: `--data-binary=-`.

`--data` (and `--data-ascii`) works much like `curl` – a prefix of `@`
indicates that the relevant data should be streamed from the file path after
the splat, and passing `-` as the parameter to `--data` will read from standard
input until EOF. Data will be sent as Content-Type
`application/x-www-form-urlencoded`.

`--data-binary` works a little differently from the `curl` option of the same
name. It doesn't URL encode the data, but it does set the Content-Type to
`application/octet-stream`, and sends the data with a binary encoding. It also
allows the use of `@` to read files and `-` for standard input.

`--data-json` is an option unique to `uncurl`. If the data isn't streaming
(that is, coming from a file or standard input), `uncurl` will verify that it's
valid JSON before sending it to the server. It will also set the Content-Type
to `application/json` and the encoding to UTF-8. It also allows the use of `@`
to read files and `-` for standard input.
