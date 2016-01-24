var Subscriber = require('../models/subscriber.js'),
    Topic = require('../models/topic.js'),
    Structure = require('../models/structure.js'),
    http = require('http');

var structure = new Structure(Subscriber, Topic);

function RestRouter(server) {
    var _this = this;
    this._server = server;
    this.getRoutes = function() {
        return [
            {
                path: '/subscribe',
                method: 'PUT',
                config: {
                    handler: function(req, reply) {
                        console.log(req.payload.address);

                        var address = req.payload.address.split(':');

                        var options = {
                            host: address[0],
                            port: address[1],
                            path: '/subscriber',
                            method: 'PUT'
                        };

                        var request = http.request(options, function(res) {
                            res.on('data', function (chunk) {
                                console.log('BODY: ' + chunk);
                            });
                        });
                        request.write(JSON.stringify({id: 123}));
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
                        console.log(req.payload.id);
                        console.log(req.connection.info.port);
                        reply('Successful subscribe');
                    }
                }
            }
    ]};

}

module.exports = RestRouter;
