const mongoose = require('mongoose');

const UserGroupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
});

module.exports = mongoose.model('UserGroup', UserGroupSchema);