const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupName: String,    
    imageUrl: String,
});

module.exports = mongoose.model('Group', GroupSchema);