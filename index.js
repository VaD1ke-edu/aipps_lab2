'use strict';
const host = 'localhost',
      port = Number(process.argv[2] || 8080);

var Hapi = require('hapi'),
    http = require('http');
const Hoek = require('hoek');

var mainRoute = require('./src/routes/main.js'),
    RestRouter = require('./src/routes/rest.js');
const server = new Hapi.Server();
var restRoutes = new RestRouter(server);

server.connection({
    port: port,
    host: host
});

server.register(require('inert'), (err) => {
    Hoek.assert(!err, err);

    ['public/css/', 'public/js/', 'public/media/'].forEach(function (item) {
        server.route({
            method: 'GET',
            path: '/' + item + '{filename*}',
            handler: function (request, reply) {
                return reply.file(item + request.params.filename);
            }
        });
    });
});

server.register(require('vision'), (err) => {
    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        layout: true,
        path: './src/views/template',
        layoutPath: './src/views/layout'
    });

    server.route(mainRoute);
});


server.register(require('inert'), (err) => {
    Hoek.assert(!err, err);
    server.route(restRoutes.getRoutes());
});

server.start();

function destructor() {
    console.log(host);
    console.log(port);
    var options = {
        host: host,
        port: port,
        path: '/unsubscribeFromAll',
        method: 'GET'
    };

    http.request(options, function(res) {
        res.on('data', function () {
            console.log('Quit');
            process.exit();
        });
    }).end();
}

process.on('SIGTERM', destructor);
process.on('SIGINT', destructor);