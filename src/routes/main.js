var Subscriber = require('../models/subscriber.js'),
    Topic = require('../models/topic.js'),
    Structure = require('../models/structure.js'),
    History = require('../models/history.js'),
    Subscription = require('../models/subscription.js'),
    http = require('http');

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
                    Subscriber.remove(Subscriber.find(socket, req.payload.topic)[0]);
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
        path: '/unsubscribeFromAll',
        method: 'GET',
        config: {
            handler: function(req, reply) {
                Subscription.getData().forEach(function(subscription) {
                    var address = subscription.address.split(':');
                    var options = {
                        host: address[0],
                        port: address[1],
                        path: '/subscriber/' + subscription.id,
                        method: 'DELETE'
                    };
                    http.request(options).end();
                });
                setTimeout(function () {
                    reply('Successfully unsubscribed from all');
                }, 600);
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
                    var title = req.payload.title,
                        content = req.payload.content,
                        socket = req.connection.info.host + ':' + req.connection.info.port;
                    Topic.add(title, content);
                    notifyTopicSubscribers(reply, title, JSON.stringify({
                        message: 'Topic with name "' + title + '" on server ' + socket + ' was updated: "' + content + '"',
                        status: 'success'
                    }));
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
                    var topic = Topic.getData()[req.params.id],
                        socket = req.connection.info.host + ':' + req.connection.info.port;
                    Topic.remove(req.params.id);
                    notifyTopicSubscribers(reply, topic.title, JSON.stringify({
                        message: 'Topic with name "' + topic.title + '" on server ' + socket + ' was deleted',
                        status: 'success'
                    }));
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
        path: '/getSubscriptions',
        method: 'GET',
        config: {
            handler: function(req, reply) {
                return reply(JSON.stringify(Subscription.getData()));
            }
        }
    },
    {
        path: '/notify',
        method: 'POST',
        config: {
            handler: function(req, reply) {
                var socket = req.connection.info.address + ':' + req.connection.info.port;
                var message = req.payload.message;
                if (!message) {
                    reply(JSON.stringify({message: 'Notification is empty', status: 'fail'}));
                    return;
                }
                History.add(message, req.payload.status);
                reply(JSON.stringify({
                    message: socket +' was successfully notified.\n Notification: ' + message,
                    status: 'success'
                }));
            }
        }
    },
    {
        path: '/getNotifications',
        method: 'GET',
        config: {
            handler: function(req, reply) {
                reply.view('history', {notifications: History.getData()}, { layout: 'main' });
            }
        }
    }
];

function notifyTopicSubscribers(reply, title, notificationMessage) {
    var subscriberIds = Subscriber.find(null, title);
    if (!subscriberIds) {
        return reply(JSON.stringify({
            status: 'success',
            message: 'You have successfully created the topic'
        }));
    }
    var subscribersToNotify = [];
    var subscribers = Subscriber.getData();

    subscriberIds.forEach(function(id) {
        if (subscribers[id] && subscribers[id].hasOwnProperty('address')) {
            subscribersToNotify.push(subscribers[id].address);
        }
    });

    subscribersToNotify.forEach(function(address) {
        address = address.split(':');

        var options = {
            host: address[0],
            port: address[1],
            path: '/notify',
            method: 'POST'
        };

        var request = http.request(options, function(res) {
            res.on('data', function (data) {
                data = JSON.parse(data);
                History.add(data.message, data.status);
            });
        });
        request.write(notificationMessage);
        request.end();
    });
}

module.exports = router;
