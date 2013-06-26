void TCPWrap::Initialize(Handle<Object> target) {
  // ...
  // lots of TCP stuff
  // ...

  target->Set(String::NewSymbol("TCP"), tcpConstructor);
}

