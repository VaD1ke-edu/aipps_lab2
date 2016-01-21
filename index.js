'use strict';
const host = 'localhost';

var Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');

var Subscriber = require('./models/subscriber.js');
var Topic = require('./models/topic.js');

const server = new Hapi.Server();

server.connection({
    port: Number(process.argv[2] || 8080),
    host: host
});

//ports = process.argv;
//if (!ports) {
//    ports = [8000];
//}

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
                    try {
                        var socket = req.connection.info.address + ':' + req.connection.info.port;
                        Subscriber.add(socket, req.payload.topic);
                        reply(JSON.stringify({
                            status: 'success',
                            message: 'You have successfully subscribed'
                        }));
                    } catch (e) {
                        reply(JSON.stringify({
                            status: 'fail',
                            message: e.message
                        }));
                    }
                }
            }
        },
        {
            path: '/unsubscribe',
            method: 'POST',
            config: {
                handler: function(req, reply) {
                    try {
                        var socket = req.connection.info.address + ':' + req.connection.info.port;
                        Subscriber.remove(Subscriber.findId(socket, req.payload.topic));
                        reply(JSON.stringify({
                            status: 'success',
                            message: 'You have successfully unsubscribed'
                        }));
                    } catch (e) {
                        reply(JSON.stringify({
                            status: 'fail',
                            message: e.message
                        }));
                    }
                }
            }
        },
        {
            path: '/topic/new',
            method: 'GET',
            config: {
                handler: function(req, reply) {
                    reply.view('topicCreate', null, { layout: 'topic' });
                }
            }
        },
        {
            path: '/topic/add',
            method: 'POST',
            config: {
                handler: function(req, reply) {
                    try {
                        Topic.add(req.payload.title, req.payload.content);
                        reply(JSON.stringify({
                            status: 'success',
                            message: 'You have successfully created the topic'
                        }));
                    } catch (e) {
                        reply(JSON.stringify({
                            status: 'fail',
                            message: e.message
                        }));
                    }
                }
            }
        },
        {
            path: '/getTopics',
            method: 'GET',
            config: {
                handler: function(req, reply) {
                    reply(JSON.stringify(Topic.getData()));
                }
            }
        },
        {
            method: 'GET',
            path: '/removeSubscriber/{id?}',
            handler: function(req, reply) {
                var id = req.params.id;
                if (!id) {
                    return reply('No id');
                }

                if (!Subscriber.getData()[id]) {
                    return reply('Subscriber not found.').code(404);
                }
                Subscriber.remove(id);
                return reply('Subscriber was removed successfully');
            }
        }
    ]);
});

server.start();
