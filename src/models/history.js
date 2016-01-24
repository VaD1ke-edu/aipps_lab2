function History(subscriberModel, topicModel) {
    var _data = {
        subscriber: subscriberModel,
        topic: topicModel
    };

    this.getData = function() {
        return _data;
    };
}

module.exports = new History();
