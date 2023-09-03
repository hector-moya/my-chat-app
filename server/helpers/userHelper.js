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

    const newUser = {
        id: users.length + 1,
        username,
        email,
        password // Note: Store hashed passwords in a production application
    };

    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser; // Destructure to remove password

    return { user: userWithoutPassword };
}