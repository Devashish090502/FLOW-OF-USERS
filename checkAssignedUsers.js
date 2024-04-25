const users = require('./data/users'); // Import user data

// Loop through users and print assigned astrologer
users.forEach(user => {
    console.log(`User ${user.name} is assigned to Astrologer ${user.assignedAstrologer}`);
});
