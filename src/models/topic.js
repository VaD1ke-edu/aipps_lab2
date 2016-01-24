function Topics() {
    const firstId = 1;
    //var _data = [{id: 0, title: 'test', content:['test', 'test1']}];
    var _data = [];
    var _increment = firstId;

    this.add = function(title, content) {
        if (!title) {
            throw new Error('Title is empty');
        }
        if (!content) {
            throw new Error('Content is empty');
        }

        var topicId = false;
        _data.forEach(function(item) {
            if (item.title == title) {
                if (item.content == content) {
                    throw new Error('Topic already exists');
                }
                topicId = item.id;
            }
        });

        if (topicId !== false) {
            _data[topicId].content.push(content);
            return topicId;
        }

        _data[_increment] = {
            id: _increment,
            title: title,
            content: [content]
        };

        return _increment++;
    };

    this.remove = function(id) {
        if (!_data[id]) {
            throw new Error('Topic with this ID not found');
        }
        delete _data[id];
    };

    this.getData = function() {
        return _data;
    };
}

module.exports = new Topics();
