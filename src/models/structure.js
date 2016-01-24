function Structure(subscriberModel, topicModel) {
    this._subscriber = subscriberModel;
    this._topic = topicModel;

    this.getData = function() {
        //return _data;
        return {
            subscribers: this._subscriber.getData(),
            topics: this._topic.getData()
        }
    };
}

module.exports = Structure;
