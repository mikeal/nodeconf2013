function noop() {}

// Export the hello function
exports.hello = function() {
  return process.binding('tcp_wrap').hello();
};

// ... lots more net.js stuff
