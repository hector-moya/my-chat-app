module.exports = {

    "users": [
        {
            "id": 1,
            "username": "super",
            "email": "super@admin.com",
            "password": "123",
            "isSuper": true
        },
        {
            "id": 2,
            "username": "groupAdmin1",
            "email": "group1@admin.com",
            "password": "password",
            "isSuper": false
        },
        {
            "id": 3,
            "username": "groupAdmin2",
            "email": "group2@admin.com",
            "password": "password",
            "isSuper": false
        },
        {
            "id": 4,
            "username": "user1",
            "email": "user1@email.com",
            "password": "password",
            "isSuper": false
        },
        {
            "id": 5,
            "username": "Hector",
            "email": "nokure@gmail.com",
            "password": "password",
            "isSuper": true
        },
        {
            "id": 6,
            "username": "Alvaro",
            "email": "my@sadf.com",
            "password": "password",
            "isSuper": false
        },
        {
            "id": 7,
            "username": "alicia",
            "email": "alica@alicai.com",
            "password": "password",
            "isSuper": false
        }
    ],
    "roles": [
        {
            "id": 1,
            "roleName": "admin"
        },
        {
            "id": 2,
            "roleName": "user"
        }
    ],
    "groups": [
        {
            "id": 2,
            "groupName": "Group2"
        },
        {
            "id": 3,
            "groupName": "The Machine"
        },
        {
            "id": 4,
            "groupName": "Group4"
        },
        {
            "id": 5,
            "groupName": "Group5"
        },
        {
            "id": 6,
            "groupName": "Group6"
        },
        {
            "id": 7,
            "groupName": "Group7"
        },
        {
            "id": 8,
            "groupName": "Group8"
        },
        {
            "id": 9,
            "groupName": "Group9"
        },
        {
            "id": 10,
            "groupName": "Group10"
        },
        {
            "id": 1,
            "groupName": "New group"
        }
    ],
    "user_group": [
        {
            "userId": 3,
            "roleId": 3,
            "groupId": 2
        },
        {
            "userId": 1,
            "roleId": 1,
            "groupId": 2
        },
        {
            "userId": 1,
            "roleId": 2,
            "groupId": 3
        },
        {
            "userId": 2,
            "roleId": 3,
            "groupId": 3
        }
    ],
    "user_channel": [
        {
            "userId": 3,
            "channelId": 3,
            "groupId": 3
        },
        {
            "userId": 2,
            "channelId": 3,
            "groupId": 3
        }
    ],
    "channels": [
        {
            "id": 3,
            "channelName": "Channel2-1",
            "groupId": 2
        },
        {
            "id": 1,
            "channelName": "Channel 56",
            "groupId": 2
        }
    ],
    "messages": [
        {
            "id": 1,
            "userId": 1,
            "message": "Hello, world!",
            "channelId": 3,
            "createdAt": "2021-10-01T00:00:00.000Z"
        },
        {
            "id": 2,
            "userId": 2,
            "message": "Hi, this is groupAdmin1!",
            "channelId": 1,
            "createdAt": "2021-10-01T00:00:00.000Z"
        },
        {
            "id": 3,
            "userId": 3,
            "message": "Hello everyone, groupAdmin2 here.",
            "channelId": 3,
            "createdAt": "2021-10-01T00:00:00.000Z"
        }
    ]
}