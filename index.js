'use strict';
const host = 'localhost';

var Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');

var mainRoute = require('./src/routes/main.js'),
    restRoute = require('./src/routes/rest.js');
const server = new Hapi.Server();

server.connection({
    port: Number(process.argv[2] || 8080),
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

server.start();
