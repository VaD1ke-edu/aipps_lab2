var Subscriber = require('../models/subscriber.js'),
    Topic = require('../models/topic.js'),
    Structure = require('../models/structure.js');

var structure = new Structure(Subscriber, Topic);

var router = [
    {
        path: '/',
        method: 'GET',
        config: {
            handler: function(req, reply) {
                reply.view('home', {topics: Topic.getData()}, { layout: 'main' });
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
                    //var address = req.info.remoteAddress + ':' + req.connection.info.port;
                    var address = req.info.remoteAddress;
                    Subscriber.add(address, req.payload.topic);
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
                    //var socket = req.connection.info.address + ':' + req.connection.info.port;
                    var socket = req.connection.info.address;
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
        path: '/topic/delete/{id?}',
        method: 'GET',
        config: {
            handler: function(req, reply) {
                try {
                    Topic.remove(req.params.id);
                    reply(JSON.stringify({
                        status: 'success',
                        message: 'You have successfully removed the topic'
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
        path: '/getStructure',
        method: 'GET',
        config: {
            handler: function(req, reply) {
                return reply(JSON.stringify(structure.getData()));
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
    },
    {
        method: 'GET',
        path: '/generateTopicEvent/{id?}',
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
];

module.exports = router;
