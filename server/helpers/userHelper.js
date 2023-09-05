const { users } =  require('../data/data.json');

/**
 * 
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
function createUser(username, email, password) {
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
        return { error: 'Username or Email already in use' };
    }

    // Generate a new user ID
    const newUserId = users.length + 1;

    const newUser = {
        id: newUserId,
        username,
        email,
        password,
        isSuper: false
    };

    users.push(newUser);
    // const { password: _, ...userWithoutPassword } = newUser; // Destructure to remove password

    return { user: newUser };
}
module.exports = { createUser };