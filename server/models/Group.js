const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupName: String,
});

module.exports = mongoose.model('Group', GroupSchema);