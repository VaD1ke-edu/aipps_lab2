function Subscribers() {
    const firstId = 0;
    var _data = [];
    var _increment = firstId;

    this.add = function(address, topic) {
        if (!address) {
            throw new Error('Address is empty');
        }
        if (!topic) {
            throw new Error('Topic is empty');
        }

        _data.forEach(function(item) {
            if (item.address == address && item.topic == topic) {
                throw new Error('You have already subscribed on this topic');
            }
        });

        _data[_increment] = {
            address: address,
            topic: topic
        };

        return _increment++;
    };
    
    this.remove = function(id) {
        console.log(id);
        if (!_data[id]) {
            throw new Error('You haven\'t subscribed on this topic yet');
        }
        delete _data[id];
    };

    this.findId = function(address, topic) {
        for (var i = firstId; i < _data.length; i++) {
            if (_data[i] && _data[i].address == address && _data[i].topic == topic) {
                return i;
            }
        }
    };

    this.getData = function() {
        return _data;
    };
}

module.exports = new Subscribers();