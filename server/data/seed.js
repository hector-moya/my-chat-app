const User = require('../models/User');
const Role = require('../models/Role');
const Channel = require('../models/Channel');
const UserChannel = require('../models/UserChannel');
const Group = require('../models/Group');
const UserGroup = require('../models/UserGroup');
const Message = require('../models/Message');
const dummyData = require('./dummyData');

async function seedDatabase() {
    // Check if super user already exists
    const superUser = await User.findOne({ email: "nokure@gmail.com" });

    if (superUser) {
        console.log("Database already seeded!");
        return;
    }

    // Seed Users
    for (let user of dummyData.users) {
        const newUser = new User(user);
        await newUser.save();
    }

    // Seed Roles
    for (let role of dummyData.roles) {
        const newRole = new Role(role);
        await newRole.save();
    }

    // Seed Channels
    for (let channel of dummyData.channels) {
        const newChannel = new Channel(channel);
        await newChannel.save();
    }

    // Seed UserChannels
    for (let userChannel of dummyData.userChannels) {
        const newUserChannel = new UserChannel(userChannel);
        await newUserChannel.save();
    }

    // Seed Groups
    for (let group of dummyData.groups) {
        const newGroup = new Group(group);
        await newGroup.save();
    }

    // Seed UserGroups
    for (let userGroup of dummyData.userGroups) {
        const newUserGroup = new UserGroup(userGroup);
        await newUserGroup.save();
    }

    // Seed Messages
    for (let message of dummyData.messages) {
        const newMessage = new Message(message);
        await newMessage.save();
    }

    console.log("Database seeded successfully!");
}

module.exports = seedDatabase;  // Export the function, not its invocation
