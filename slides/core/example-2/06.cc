void TCPWrap::Initialize(Handle<Object> target) {
  // ...
  // lots of TCP stuff
  // ...

  target->Set(String::NewSymbol("TCP"), tcpConstructor);

  // Export our function here.
  NODE_SET_METHOD(target, "hello", Hello);
}

