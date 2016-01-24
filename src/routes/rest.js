var Subscriber = require('../models/subscriber.js'),
    Topic = require('../models/topic.js'),
    Structure = require('../models/structure.js'),
    History = require('../models/history.js'),
    Subscription = require('../models/subscription.js'),
    http = require('http');


function RestRouter(server) {
    this.getRoutes = function() {
        return [
            {
                path: '/subscribe',
                method: 'PUT',
                config: {
                    handler: function(req, reply) {
                        var address = req.payload.address.split(':');
                        var socket = req.connection.info.host + ':' + req.connection.info.port;

                        var options = {
                            host: address[0],
                            port: address[1],
                            path: '/subscriber',
                            method: 'PUT'
                        };

                        var request = http.request(options, function(res) {
                            res.on('data', function (data) {
                                data = JSON.parse(data);
                                History.add(data.message, data.status);
                                if (data.status == 'success') {
                                    Subscription.add(data.id, data.address);
                                }
                            });
                        });
                        request.write(JSON.stringify({address: socket, topic: req.payload.topic}));
                        request.end();
                        reply('success');
                    }
                }
            },
            {
                path: '/subscriber',
                method: 'PUT',
                config: {
                    handler: function(req, reply) {
                        try {
                            var address = req.payload.address,
                                topic = req.payload.topic,
                                socket = req.connection.info.host + ':' + req.connection.info.port;
                            var id = Subscriber.add(address, topic);
                            reply(JSON.stringify({
                                message: 'You have successfully subscribed on topic "' + topic + '" on server ' + socket,
                                status: 'success',
                                address: socket,
                                id: id
                            }));
                        } catch (e) {
                            reply(JSON.stringify({
                                message: e.message, status: 'fail'
                            }));
                        }
                    }
                }
            },
            {
                path: '/subscriber/{id?}',
                method: 'DELETE',
                config: {
                    handler: function(req, reply) {
                        try {
                            var subscriber = Subscriber.remove(req.params.id);
                            reply('Subscriber with ID ' + req.params.id + ' was successfully unsubscribed');
                            var address = subscriber.address.split(':');
                            var socket = req.connection.info.host + ':' + req.connection.info.port;

                            var options = {
                                host: address[0],
                                port: address[1],
                                path: '/notify',
                                method: 'POST'
                            };

                            var request = http.request(options);
                            request.write(JSON.stringify({
                                message: 'You were unsubscribed from topic "' + subscriber.topic + '" on server ' + socket,
                                status: 'success'
                            }));
                            request.end();
                        } catch (e) {
                            reply({message: e.message, status: 'fail'});
                        }
                    }
                }
            }
    ]};
}

module.exports = RestRouter;
