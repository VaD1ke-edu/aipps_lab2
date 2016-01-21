function Subscribers() {
    this._data = [];

    this.add = function (email, topic) {
        if (!email) {
            throw new Error('Email is empty');
        }

        if (!topic) {
            throw new Error('Topic is empty');
        }

        this._data.forEach(function(item) {
            if (item.topic == topic && item.email == email) {
                throw new Error('Already subscribe');
            }
        });

        this._data.push({
            email: email,
            topic: topic
        });

        return this._data.length - 1;
    };
    this.remove = function (email, topic) {

    };

    this.getData = function () {
        return this._data;
    };
}

module.exports = new Subscribers();
