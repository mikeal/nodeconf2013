var hapi = require('hapi');

var server = new hapi.Server(8000);

var version = function (req) {
    req.reply({ version: '1.0.0' });
};

server.route({
    method: 'GET',
    path: '/version',
    handler: version
});

server.start();
