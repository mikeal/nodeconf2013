using v8::Value;

static Persistent<Function> tcpConstructor;
static Persistent<String> oncomplete_sym;
static Persistent<String> onconnection_sym;


typedef class ReqWrap<uv_connect_t> ConnectWrap;

Local<Object> AddressToJS(const sockaddr* addr);


// add the function here.
// Below all the definitions at the top
Handle<Value> TCPWrap::Hello(const Arguments& args) {
  // Define a HandleScope.  This lets the garbage collector
  // do the magic thing with cleaning up any data we create
  HandleScope scope;

  // Return the JavaScript string "world"
  return scope.Close(String::New("world"));
}


Local<Object> TCPWrap::Instantiate() {
  // If this assert fire then process.binding('tcp_wrap') hasn't been
  // called yet.
  assert(tcpConstructor.IsEmpty() == false);

  HandleScope scope;
  Local<Object> obj = tcpConstructor->NewInstance();
