const domain = 'localhost';

var Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');

var Subscriber = require('./models/subscriber.js');

const server = new Hapi.Server();

server.connection({
    port: Number(process.argv[2] || 8080),
    host: 'localhost'
});


server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        layout: true,
        path: './views/template',
        layoutPath: './views/layout'
    });

    server.route([
        {
            path: '/',
            method: 'GET',
            config: {
                handler: function(req, reply) {
                    reply.view('home', null, { layout: 'main' });
                }
            }
        },
        {
            path: '/getSubscribers',
            method: 'GET',
            config: {
                handler: function(req, reply) {
                    reply(JSON.stringify(Subscriber.getData()));
                }
            }
        },
        {
            path: '/subscribe',
            method: 'POST',
            config: {
                handler: function(req, reply) {
                    Subscriber.add(1, 2);
                }
            }
        }
    ]);
});


server.start();
