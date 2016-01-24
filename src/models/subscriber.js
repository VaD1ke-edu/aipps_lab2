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
        if (!_data[id]) {
            throw new Error('You haven\'t subscribed on this topic yet');
        }
        var dataToDelete = _data[id];
        delete _data[id];
        return dataToDelete;
    };

    this.removeByAddress = function(address) {
        var ids = [];
        for (var i = firstId; i < _data.length; i++) {
            if (_data[i] && _data[i].address == address) {
                ids.push(i);
            }
        }
        ids.forEach(function (id) {
            delete _data[id];
        });
    };

    this.removeAll = function() {
        _data = {};
        _increment = firstId;
    };

    this.find = function(address, topic) {
        var ids = [];
        if (address) {

        }
        for (var i = firstId; i < _data.length; i++) {
            if (_data[i]
                && (_data[i].address == address || !address)
                && (_data[i].topic == topic || !topic)) {
                ids.push(i);
            }
        }
        return ids;
    };

    this.getData = function() {
        return _data;
    };
}

module.exports = new Subscribers();
