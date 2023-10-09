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
    const userIds = {};
    const roleIds = {};
    const groupIds = {};
    const channelIds = {};

    if (superUser) {
        console.log("Database already seeded!");
        return;
    }

    // Seed Users
    for (let user of dummyData.users) {
      const newUser = new User({
        userName: user.username,
        email: user.email,
        password: user.password,
        status: user.status,
      });
      await newUser.save();
      userIds[user.id] = newUser._id;
    }
    console.log("User IDs mapping:", userIds);

    // Seed Roles
    for (let role of dummyData.roles) {
        const newRole = new Role({
            roleName: role.roleName
        });
        await newRole.save();
        roleIds[role.id] = newRole._id;
    }
    console.log("Role IDs mapping:", roleIds);

    // Seed Groups
    for (let group of dummyData.groups) {
        const newGroup = new Group({
            groupName: group.groupName
        });
        await newGroup.save();
        groupIds[group.id] = newGroup._id;
    }
    console.log("Group IDs mapping:", groupIds);

    // Seed Channels
    for (let channel of dummyData.channels) {
        const newChannel = new Channel({
            channelName: channel.channelName,
            groupId: groupIds[channel.groupId]            
        });
        await newChannel.save();
        channelIds[channel.id] = newChannel._id;
    }
    console.log("Channel IDs mapping:", channelIds);

    // Seed UserGroups
    for (let userGroup of dummyData.user_group) {
        const newUserGroup = new UserGroup({
            userId: userIds[userGroup.userId],
            roleId: roleIds[userGroup.roleId],
            groupId: groupIds[userGroup.groupId]
        });
        await newUserGroup.save();
    }

    // Seed UserChannels
    for (let userChannel of dummyData.user_channel) {
        const newUserChannel = new UserChannel({
            userId: userIds[userChannel.userId],
            channelId: channelIds[userChannel.channelId],
            groupId: groupIds[userChannel.groupId]
        });
        await newUserChannel.save();
    }

    // Seed Messages
    for (let message of dummyData.messages) {
        console.log("Mapping userId:", userIds[message.userId]);
        console.log("Mapping channelId:", channelIds[message.channelId]);

        const newMessage = new Message({
            userId: userIds[message.userId],
            message: message.message,
            channelId: channelIds[message.channelId],
            createdAt: new Date(message.createdAt)
        });
        console.log(newMessage);
        await newMessage.save();
    }

    console.log("Database seeded successfully!");
}

module.exports = seedDatabase;  // Export the function, not its invocation
