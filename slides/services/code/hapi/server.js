var hapi = require('hapi');
var users = require('./users.json');


// Create server

var server = new hapi.Server(8000);

// Extension header

server.ext('onPreResponse', function (request, next) {

    request.response().header && request.response().header('X-API-Version', '1.0.0');
    return next();
});

// Basic authentication

var validate = function (username, password, callback) {

    var result = (username === 'steve' && password === '12345');
    callback(null, result, { user: 'steve' });
};

server.auth('password', {
    scheme: 'basic',
    validateFunc: validate
});

// Version endpoint

var version = function (req) {

    req.reply({ version: '1.0.0' });
};

server.route({
    method: 'GET',
    path: '/version',
    handler: version
});

// User lookup endpoint

var user = function (req) {

    if (!req.params.id) {
        return req.reply(users);
    }

    var item = users[req.params.id];
    if (!item) {
        return req.reply(hapi.error.notFound());
    }

    req.reply(item);
};

server.route({
    method: 'GET',
    path: '/user/{id?}',
    handler: user,
    config: { auth: 'password' }
});

// Register endpoint

var register = function (req) {

    // use req.payload to create new user
};

server.route({
    method: 'POST',
    path: '/user',
    handler: register,
    config: {
        validate: {
            payload: {
                name: hapi.types.String().alphanum().max(30).required()
            }
        }
    }
});

// Start server

server.start();
