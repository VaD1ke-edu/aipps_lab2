function Subscriptions() {
    var _data = [];

    this.add = function(id, address) {
        if (!address) {
            throw new Error('Address of subscription is empty');
        }
        if (!id) {
            throw new Error('ID of subscription is empty');
        }

        _data[id] = {
            id: id,
            address: address
        };

        return id;
    };

    this.remove = function(id) {
        if (!_data[id]) {
            throw new Error('Subscription with this ID doesn\'t exist');
        }
        var dataToDelete = _data[id];
        delete _data[id];
        return dataToDelete;
    };

    this.getData = function() {
        return _data;
    };
}

module.exports = new Subscriptions();
