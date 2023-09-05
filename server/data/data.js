// Dummy data for Users
const users = [
    {
      id: 1,
      username: 'superAdmin',
      email: 'super@admin.com',
      password: 'password',
      isSuper: true
    },
    {
      id: 2,
      username: 'groupAdmin1',
      email: 'group1@admin.com',
      password: 'password',
      isSuper: false
    },
    {
      id: 3,
      username: 'groupAdmin2',
      email: 'group2@admin.com',
      password: 'password',
      isSuper: false
    },
    {
      id: 4,
      username: 'user1',
      email: 'user1@email.com',
      password: 'password',
      isSuper: false
    }
  ];
  
  // Dummy data for Roles
  const roles = [
    {
      id: 1,
      roleName: 'Group Admin'
    },
    {
      id: 2,
      roleName: 'User'
    }
  ];
  
  // Dummy data for Groups
  const groups = [
    {
      id: 1,
      groupName: 'Group1'
    },
    {
      id: 2,
      groupName: 'Group2'
    }
  ];
  
  // Dummy data for User_Channel
  const user_channel = [
    {
      userID: 1,
      channelID: 1
    },
    {
      userID: 2,
      channelID: 2
    },
    {
      userID: 3,
      channelID: 3
    }
  ];
  
  // Dummy data for User_Group
  const user_group = [
    {
      userID: 1,
      roleID: 1,
      groupID: 1
    },
    {
      userID: 2,
      roleID: 2,
      groupID: 1
    },
    {
      userID: 3,
      roleID: 3,
      groupID: 2
    }
  ];
  
  // Dummy data for Channel
  const channels = [
    {
      id: 1,
      groupID: 1,
      channelName: 'Channel1-1'
    },
    {
      id: 2,
      groupID: 1,
      channelName: 'Channel1-2'
    },
    {
      id: 3,
      groupID: 2,
      channelName: 'Channel2-1'
    }
  ];
  
  // Dummy data for Messages
  const messages = [
    {
      id: 1,
      userID: 1,
      message: 'Hello, world!',
      channelID: 1,
      timestamp: new Date()
    },
    {
      id: 2,
      userID: 2,
      message: 'Hi, this is groupAdmin1!',
      channelID: 2,
      timestamp: new Date()
    },
    {
      id: 3,
      userID: 3,
      message: 'Hello everyone, groupAdmin2 here.',
      channelID: 3,
      timestamp: new Date()
    }
  ];
  
  module.exports = { users, roles, groups, user_channel, user_group, channels, messages };