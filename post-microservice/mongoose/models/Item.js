var mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    username: {type: String, required: true, lowercase: true},
    content: {type: String, required: true},
    childType: {type: String},
    likes: {type: Number, required: true},
    retweeted: {type: Number, required: true},
    timestamp: {type: String, required: true},
    parent: {type: String},
    media: {type: Array, "default":[]},
    likedby: {type: Array, "default":[]}
});

module.exports = mongoose.model('Item', ItemSchema);
