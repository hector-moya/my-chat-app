const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', './data/data.json');

/**
 * 
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
function createUser(username, email, password) {
    const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const existingUser = existingData.users.find(u => u.email === email || u.username === username);

    if (existingUser) {
        return { error: 'Username or Email already in use' };
    }

    // Generate a new user ID
    const newUserId = existingData.users.length > 0 ? Math.max(existingData.users.map(u => u.id)) + 1 : 1;

    const newUser = {
        id: newUserId,
        username,
        email,
        password,
        isSuper: false
    };

    existingData.users.push(newUser);

    try {
        // Write the updated data back to the file
        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        return { user: newUser };
    } catch (error) {
        return { error: 'Failed to register user.' };
    }
}
module.exports = { createUser };