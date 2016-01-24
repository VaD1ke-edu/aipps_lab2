function History() {
    const firstId = 0;
    var _data = [];
    var _increment = firstId;

    this.add = function(message, status) {
        if (!message) {
            throw new Error('Message is empty');
        }

        _data[_increment] = {
            message: message,
            created_at: getDateTime(),
            status: status
        };

        return _increment++;
    };

    this.remove = function(id) {
        if (!_data[id]) {
            throw new Error('Notification doesn\'t exist');
        }
        delete _data[id];
    };

    this.getData = function() {
        return _data;
    };

    function getDateTime() {
        var currentDate = new Date();
        return currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds() + " "
            + currentDate.getDate() + "-"
            + (currentDate.getMonth() + 1) + "-"
            + currentDate.getFullYear();
    }
}

module.exports = new History();
