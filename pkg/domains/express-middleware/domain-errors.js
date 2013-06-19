// dependencies go here

module.exports = function errorHandlerGenerator() {
  return function totallyUseless(error, req, res, next) {
    //
    // your domain-enhanced error-handling code goes here:
    //
    return next(error);
  };
};
